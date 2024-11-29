import express from "express";
import authRouter from "./routes/authRouter";
import postRouter from "./routes/postRouter";
import trainRouter from "./routes/trainRouter";

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
