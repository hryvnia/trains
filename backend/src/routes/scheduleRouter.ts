import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware } from "../middleware/auth";

import {
  createSchedule,
  updateSchedule,
  getSchedules,
  deleteSchedule,
  getScheduleStats,
} from "../controllers/scheduleController";

const router = express.Router();

// Маршрут для отримання всіх розкладів
router.get("", authMiddleware, getSchedules);

// Маршрут для створення нового розкладу
router.post("", authMiddleware, createSchedule);

// Маршрут для оновлення розкладу за його id
router.patch("/:id", authMiddleware, updateSchedule);

// Маршрут для видалення розкладу за його id
router.delete("/:id", authMiddleware, deleteSchedule);

// Маршрут для отримання статистики розкладів за конкретну дату
router.get("/stats/:date", authMiddleware, getScheduleStats);

export default router;
