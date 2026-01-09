import Questions from "../models/questionsSchema.js";
import Response from "../models/responseSchema.js";
import mongoose from "mongoose";
import { io } from "../index.js";

export const createSurvey = async (req, res) => {
  try {
    const { title, Description, questions } = req.body;

    if (!title || !questions?.length) {
      return res.status(400).json({ message: "Title and questions are required" });
    }

    
    const formattedQuestions = questions.map((q, i) => {
      if (!q.questiontext || !q.type) {
        throw new Error(`Question ${i + 1} is missing questiontext or type`);
      }
      return {
        questiontext: q.questiontext.trim(),
        type: q.type,
        options: q.type === "mcq" ? q.options || [] : [],
      };
    });

    const survey = await Questions.create({
      title: title.trim(),
      Description: Description?.trim() || "",
      User: req.user.id,
      questions: formattedQuestions,
    });

    res.status(201).json({
      message: "Survey published successfully",
      survey,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getAllSurveysExceptMine = async (req, res) => {
  try {
    const surveys = await Questions.find({
      User: { $ne: req.user.id }
    }).populate("User", "name");

    res.json(surveys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const participateSurvey = async (req, res) => {
    const survey = await Questions.findById(req.params.id);
    res.json(survey);
  };
  
  export const mysurvey = async (req, res) => {
    try {
      const surveys = await Questions.find({ User: req.user.id })
        .select("title Description createdAt");
  
      const result = await Promise.all(
        surveys.map(async (survey) => {
          const totalResponses = await Response.countDocuments({
            surveyId: survey._id   // ✅ FIXED HERE
          });
  
          return {
            ...survey.toObject(),
            totalResponses
          };
        })
      );
  
      res.json(result);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  

  export const submitResponse = async (req, res) => {
    try {
      const { surveyId, answers } = req.body;
  
      if (!surveyId || !answers) {
        return res.status(400).json({ message: "Invalid data" });
      }
  
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer
        })
      );
  
      await Response.create({
        surveyId,
        userId: req.user.id,
        answers: formattedAnswers
      });
  
      // 🔥 COUNT TOTAL RESPONSES
      const totalResponses = await Response.countDocuments({ surveyId });
  
      // 🔥 REAL TIME EMIT TO OWNER
      io.to(surveyId).emit("responseUpdated", {
        surveyId,
        totalResponses
      });
  
      res.json({
        message: "Survey submitted successfully",
        totalResponses
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

export const deleteMySurvey = async (req, res) => {
  try {
    const { id } = req.params;

    const survey = await Questions.findById(id);

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }


    if (survey.User.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await survey.deleteOne();

    res.json({ message: "Survey deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSurveyAnalytics = async (req, res) => {
  try {
    const { surveyId } = req.params;

    const survey = await Questions.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    const totalResponses = await Response.countDocuments({ surveyId });

    const analytics = [];

    for (let q of survey.questions) {
      const result = await Response.aggregate([
        {
          $match: {
            surveyId: new mongoose.Types.ObjectId(surveyId)
          }
        },
        { $unwind: "$answers" },
        {
          $match: {
            "answers.questionId": q._id
          }
        },
        {
          $group: {
            _id: "$answers.answer",
            count: { $sum: 1 }
          }
        }
      ]);

      analytics.push({
        questionId: q._id,
        questionText: q.questiontext,
        type: q.type,
        data: result
      });
    }

    res.json({
      surveyId,
      title: survey.title,
      totalResponses,
      analytics
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
