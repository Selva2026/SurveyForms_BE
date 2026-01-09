import express from 'express';
import { createSurvey,
     deleteMySurvey,
     getAllSurveysExceptMine,
      getSurveyAnalytics,
      mysurvey,
      participateSurvey, 
      submitResponse} from '../controllers/surveyController.js';
import protect from '../middlewares/middleware.js';


const route = express.Router();


route.post("/create", protect ,  createSurvey);
route.get("/all", protect, getAllSurveysExceptMine);
route.get("/part/:id", protect, participateSurvey);
route.get("/mysurvey", protect, mysurvey);
route.post("/submit", protect, submitResponse);
route.delete("/delete/:id", protect, deleteMySurvey);
route.get("/analytics/:surveyId", protect, getSurveyAnalytics);


export default route