import express from 'express';
import dotenv from 'dotenv';
import { ConnectDb } from './config/DB.js';
import route from './routes/userRoutes.js';
import routes from './routes/surveyRoutes.js';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const PORT1 = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "https://surveyformsapp.netlify.app/",
    methods: ["GET", "POST"]
  }
});

ConnectDb();

app.use(cors());
app.use(express.json());
app.use("/api", route);
app.use("/api/survey", routes);
app.get("/", (req, res) => {
    res.send("Backend Running OK");
  });


  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
  
    socket.on("joinSurvey", (surveyId) => {
      socket.join(surveyId);
    });
  
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  });


app.listen(PORT1, ()=>{
    console.log("Server is Running from ", PORT1);
    
})







