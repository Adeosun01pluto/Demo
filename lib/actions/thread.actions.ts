"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { FilterQuery, SortOrder } from "mongoose";

export async function fetchPosts_({after, search}:any) {
  connectToDB();
  const regexEx = new RegExp(search, "i");
    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find({ })
    .skip(after)
    .limit(1);

  return postsQuery;
}
export async function fetchPosts({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 4,
  sortBy = "-_id",
  searchParams
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  searchParams?: string;
}) {
  connectToDB();
  const next  = searchParams || null
  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;
  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i");
  // Create an initial query object to filter posts.
  const query: FilterQuery<typeof Thread> = {   
    userId: userId, // Include only posts created by the current user.
    parentId: { $in: [null, undefined] },
  };

  // If the search query is not empty, add the $or operator to match either title or content fields.
  if (searchString.trim() !== "") {
    query.$or = [
      { text: { $regex: regex } },
    ];
  }
  // Define the sort options for the fetched posts based on createdAt field and provided sort order.
  const sortOptions = { createdAt: sortBy };
  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find(query)
    .skip(skipAmount).limit(pageSize).sort(sortBy)
    // Count the total number of top-level posts (threads) i.e., threads that are not comments.
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Get the total count of posts
    
    const posts = await postsQuery.exec();
    const next_cursor = posts[posts.length - 1]?._id.toString() || undefined
    // Manually populate the fields
    const populatedPosts = await Promise.all(posts.map(async (post) => {
      const author = await User.findById(post.author);
      const community = await Community.findById(post.community);
      const children = await Promise.all(post.children.map(async (childId : any) => {
        const child = await Thread.findById(childId);
        const childAuthor = await User.findById(child.author);
        return {
          ...child.toObject(),
          author: childAuthor ? { _id: childAuthor._id, name: childAuthor.name, image: childAuthor.image } : null,
        };
      }));

      return {
        ...post.toObject(),
        author: author ? { _id: author._id, name: author.name, image: author.image } : null,
        community: community ? { name: community.name, profile: community.profile, id: community.id } : null,
        children,
      };
    }));
    const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts :populatedPosts , isNext, next_cursor };
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  photos:string[] | null 
}

export async function createThread({ text, author, communityId, path, photos }: Params
) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      photos: photos,
      text,
      author,
      community: communityId,
    });
    await createdThread.save()
   // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (communityId) {
      // Update Community model
      await Community.findByIdAndUpdate(communityId, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}

export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();
    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();
  //  // Add the activity to the author's User Model
  //  const author = await User.findById(originalThread.author); // Assuming the author's ID is stored in the original thread
  //  if (author) {
  //    author.activities.push({ _id: userId, type: "reply_thread", threadId });
  //    await author.save();
  //  }

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function searchThreads({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of threads to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter threads.
    const query: FilterQuery<typeof Thread> = {};

    // If the search string is not empty, add the $or operator to match the text or other relevant fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { text: { $regex: regex } }, // Match the text field
        // Add more fields to search here if needed
      ];
    }

    // Define the sort options for the fetched threads based on createdAt field.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the threads based on the search and sort criteria.
    const threadsQuery = Thread.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author"); // You can populate other fields if needed

    // Count the total number of threads that match the search criteria (without pagination).
    const totalThreadsCount = await Thread.countDocuments(query);

    const threads = await threadsQuery.exec();

    // Check if there are more threads beyond the current page.
    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (error) {
    console.error("Error searching threads:", error);
    throw error;
  }
}

export async function likeThread(threadId: string, userId: string): Promise<string[]> {
  try {
    connectToDB(); // Make sure you've implemented your DB connection logic

    // Check if the user has already liked the thread
    const thread = await Thread.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    if (thread.likes.includes(userId)) {
      // User has already liked the thread, so remove the like
      thread.likes.pull(userId);
    } else {
      // User has not liked the thread, so add the like
      thread.likes.push(userId);
      // const author = await User.findById(userId); // Assuming the author's ID is stored in the original thread
      // if (author) {
      //   author.activities.push({ _id: userId, type: "like_thread", threadId});
      //   await author.save();
      // }
    }

    await thread.save();
    console.log(thread)
    return thread.likes; // Return the updated list of likes for the thread
  } catch (error : any ) {
    throw new Error(`Failed to like/unlike thread: ${error.message}`);
  }
}

export async function repostThread(threadId: string, userId: string): Promise<string[]> {
  try {
    connectToDB(); // Make sure you've implemented your DB connection logic

    // Check if the user has already repost the thread
    const thread = await Thread.findById(threadId);
    const user = await User.findById(userId);
    if (!thread) {
      throw new Error('thread not found');
    }
    if (thread.repost.includes(userId)) {
      // User has already repost the thread, so remove the like
      thread.repost.pull(userId);
      user.repost.pull(threadId);
    } else {
      thread.repost.push(userId);
      user.repost.push(threadId);
    }
    await thread.save();
    await user.save();
    
    return thread.repost; // Return the updated list of likes for the question
  } catch (error : any ) {
    throw new Error(`Failed to like/unlike question: ${error.message}`);
  }
}