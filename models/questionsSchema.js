import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questiontext: { type: String, required: true },
  type: { type: String, enum: ["text", "mcq"], required: true },
  options: { type: [String], default: [] }, 
});

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  Description: { type: String },
  User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questions: { type: [questionSchema], default: [] },
});

const Questions = mongoose.model("Questions", surveySchema);
export default Questions;
