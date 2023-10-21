import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  likes: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  repost: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photos:{
    type: [String],
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Question = mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;