import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  createTrain,
  getTrains,
  updateTrain,
  deleteTrain,
} from "../controllers/trainController";

const router = express.Router();

// Маршрут для отримання всіх поїздів
router.get("", getTrains);

// Маршрут для створення нового поїзда
router.post("", authMiddleware, createTrain);

// Маршрут для оновлення поїзда за його id
router.patch("/:id", authMiddleware, updateTrain);

// Маршрут для видалення поїзда за його id
router.delete("/:id", authMiddleware, deleteTrain);

export default router;
