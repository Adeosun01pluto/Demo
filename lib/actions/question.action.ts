"use server"

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Question from "../models/question.model";
import Community from "../models/community.model";
import { FilterQuery } from "mongoose";
import { SortOrder } from "mongoose";




export async function fetchQuestions({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;
  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i");
  // Create an initial query object to filter posts.
  const query: FilterQuery<typeof Question> = {
    userId: userId, // Include only posts created by the current user.
    parentId: { $in: [null, undefined] }
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
  const questionsQuery = Question.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Question.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const questions = await questionsQuery.exec();

  const isNext = totalPostsCount > skipAmount + questions.length;

  return { questions, isNext };
}
  
  interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
    photos: string[] | null
  }
  
  export async function createQuestion({ text, author, communityId, path, photos }: Params
  ) {
    try {
      connectToDB();
  
      const createdQuestion = await Question.create({
        photos:photos,
        text,
        author,
        community: communityId, // Assign communityId if provided, or leave it null for personal account
      });
      await createdQuestion.save()
      // Update User model
      await User.findByIdAndUpdate(author, {
        $push: { threads: createdQuestion._id },
      });
  
      if (communityId) {
        // Update Community model
        await Community.findByIdAndUpdate(communityId, {
          $push: { questions: createdQuestion._id },
        });
      }
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to create question: ${error.message}`);
    }
  }


  
async function fetchAllChildQuestions(threadId: string): Promise<any[]> {
    const childThreads = await Question.find({ parentId: threadId });
  
    const descendantThreads = [];
    for (const childThread of childThreads) {
      const descendants = await fetchAllChildQuestions(childThread._id);
      descendantThreads.push(childThread, ...descendants);
    }
  
    return descendantThreads;
  }
  
  export async function deleteQuestion(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the thread to be deleted (the main thread)
      const mainThread = await Question.findById(id).populate("author community");
  
      if (!mainThread) {
        throw new Error("Question not found");
      }
  
      // Fetch all child threads and their descendants recursively
      const descendantThreads = await fetchAllChildQuestions(id);
  
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
      await Question.deleteMany({ _id: { $in: descendantThreadIds } });
  
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
      throw new Error(`Failed to delete question: ${error.message}`);
    }
  }
  
  export async function fetchQuestionById(questionId: string) {
    connectToDB();
  
    try {
      const thread = await Question.findById(questionId)
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
              model: Question, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image photos", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();
  
      return thread;
    } catch (err) {
      console.error("Error while fetching question:", err);
      throw new Error("Unable to fetch question");
    }
  }
  
  export async function addANswerToQuestion(
    questionId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    connectToDB();
  
    try {
      // Find the original thread by its ID
      const originalThread = await Question.findById(questionId);
  
      if (!originalThread) {
        throw new Error("Question not found");
      }
  
      // Create the new comment thread
      const commentThread = new Question({
        text: commentText,
        author: userId,
        parentId: questionId, // Set the parentId to the original thread's ID
      });
  
      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save();
  
      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id);
  
      // Save the updated original thread to the database
      await originalThread.save();
      // // Add the activity to the author's User Model
      // const author = await User.findById(originalThread.author); // Assuming the author's ID is stored in the original thread
      // if (author) {
      //   author.activities.push({ _id: userId, type: "answer_question", questionId });
      //   await author.save();
      // }
  
      revalidatePath(path);
    } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
    }
  }

  export async function searchQuestions({
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
  
      // Calculate the number of questions to skip based on the page number and page size.
      const skipAmount = (pageNumber - 1) * pageSize;
  
      // Create a case-insensitive regular expression for the provided search string.
      const regex = new RegExp(searchString, "i");
  
      // Create an initial query object to filter questions.
      const query: FilterQuery<typeof Question> = {};
  
      // If the search string is not empty, add the $or operator to match the text or other relevant fields.
      if (searchString.trim() !== "") {
        query.$or = [
          { text: { $regex: regex } }, // Match the text field
          // Add more fields to search here if needed
        ];
      }
  
      // Define the sort options for the fetched questions based on createdAt field.
      const sortOptions = { createdAt: sortBy };
  
      // Create a query to fetch the questions based on the search and sort criteria.
      const questionsQuery = Question.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)
        .populate("author"); // You can populate other fields if needed
  
      // Count the total number of questions that match the search criteria (without pagination).
      const totalQuestionsCount = await Question.countDocuments(query);
  
      const questions = await questionsQuery.exec();
  
      // Check if there are more questions beyond the current page.
      const isNext = totalQuestionsCount > skipAmount + questions.length;
  
      return { questions, isNext };
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  }
  

  export async function likeQuestion(questionId: string, userId: string): Promise<string[]> {
    try {
      connectToDB(); // Make sure you've implemented your DB connection logic
  
      // Check if the user has already liked the thread
      const question = await Question.findById(questionId);
      if (!question) {
        throw new Error('question not found');
      }
      console.log(questionId, userId)
      if (question.likes.includes(userId)) {
        // User has already liked the question, so remove the like
        question.likes.pull(userId);
      } else {
        // User has not liked the question, so add the like
        question.likes.push(userId);
        // const author = await User.findById(userId); // Assuming the author's ID is stored in the original question
        // if (author) {
        //   author.activities.push({ _id: userId, type: "like_question", questionId});
        //   await author.save();
        // }
      }
  
      await question.save();
      
      return question.likes; // Return the updated list of likes for the question
    } catch (error : any ) {
      throw new Error(`Failed to like/unlike question: ${error.message}`);
    }
  }