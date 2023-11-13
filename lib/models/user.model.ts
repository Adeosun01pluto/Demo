import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  followers: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  followings: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  onboarded: {    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  repost: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  repostQuestion: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  // activities: [
  //   {
  //     _id: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //     },
  //     type: {
  //       type: String,
  //       enum: ["like_thread", "reply_thread", "like_question", "answer_question"],
  //     },
  //     threadId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Thread",
  //     },
  //   },
  // ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;