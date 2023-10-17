"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Question from "../models/question.model";
import { revalidatePath } from "next/cache";
  interface Params {
    id: string,
    name: string,
    description: string,
    username: string | null,
    image: string,
    createdById: string
  }
export async function createCommunity({
  id,
  name,
  username,
  image,
  description,
  createdById
} : Params) {
  try {
    connectToDB();
    // Find the user with the provided unique id
    const user = await User.findById(createdById);
    if (!user) {
      throw new Error("User not found"); // Handle the case if the user with the id is not found
    }
    const newCommunity = new Community({
      name,
      username,
      description,
      profile : image,
      createdBy: user._id, // Use the mongoose ID of the user
    });
    
    const createdCommunity = await newCommunity.save();
    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error creating community:", error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    connectToDB();

    const communityDetails = await Community.findById(id).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community details:", error);
    throw error;
  }
}
export async function fetchCommunityPosts(id: string) {
  try {
    connectToDB();
    const communityPosts = await Thread.find({ community: id })
      .populate({
        path: "author",
        model: User,
        select: "name image id",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "image _id",
      }
    })
    .populate({
        path: "community",
        model: Community,
        select: "name profile", // Select the "name" field from the "Community" model
    })
    return communityPosts;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
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

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectToDB();

    // Find the community by its unique id
    const community = await Community.findOne({ id: communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    // Find the user by their unique id
    const user = await User.findOne({ id: memberId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectToDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

interface Props {
  name: string,
  username: string,
  communityId: string | null,
  description: string,
  profile: string | null
}


export async function updateCommunityInfo({
  communityId,
  name,
  username,
  description,
  profile
}: Props) {
  try {
    connectToDB();
    // console.log(  communityId,
    //   name,
    //   username,
    //   description,
    //   profile)
    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { _id: communityId },
      { name, username, profile, description }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectToDB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Delete all threads associated with the community
    await Thread.deleteMany({ community: communityId });

    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  photos: string[] | null
}

export async function createCommunityQuestion({ text, author, communityId, path, photos }: Params
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
        $push: { threads: createdQuestion._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create question: ${error.message}`);
  }
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  photos:string[] | null 
}

export async function createCommunityThread({ text, author, communityId, path, photos }: Params
) {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      photos: photos,
      text,
      author,
      community: communityId, // Assign communityId if provided, or leave it null for personal account
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
