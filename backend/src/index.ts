import express from "express";

import authRouter from "./routes/authRouter";
import postRouter from "./routes/postRouter";
import scheduleRouter from "./routes/scheduleRouter";
import stationRouter from "./routes/stationRouter";
import trainRouter from "./routes/trainRouter";

import reportRouter from "./routes/reportRouter";

import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
connectDB();

const port = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Укажи домен своего фронтенда
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/trains", trainRouter);
app.use("/api/stations", stationRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/reports", reportRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
