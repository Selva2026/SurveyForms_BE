import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        answer: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);
