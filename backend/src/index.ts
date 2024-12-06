import express from "express";

import authRouter from "./routes/authRouter";
import scheduleRouter from "./routes/scheduleRouter";
import stationRouter from "./routes/stationRouter";
import trainRouter from "./routes/trainRouter";

import reportRouter from "./routes/reportRouter";

import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Завантаження змінних середовища з .env
connectDB(); // Підключення до БД

const port = process.env.PORT || 3000;
const app = express();

// Налаштування CORS для дозволу доступу з конкретного домену
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Маршрути для API
app.use("/api/auth", authRouter);
app.use("/api/trains", trainRouter);
app.use("/api/stations", stationRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/reports", reportRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
