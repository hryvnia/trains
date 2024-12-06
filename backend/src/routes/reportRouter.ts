import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware } from "../middleware/auth";

import {
  getReports,
  generateReport,
  deleteReport,
  exportReportToCSV,
} from "../controllers/reportController";

const router = express.Router();

// Маршрут для отримання всіх звітів
router.get("", authMiddleware, getReports);

// Маршрут для генерації нового звіту
router.post("", authMiddleware, generateReport);

// Маршрут для видалення звіту за його id
router.delete("/:id", authMiddleware, deleteReport);

// Маршрут для експорту звіту в CSV за його id
router.get("/:id/export", authMiddleware, exportReportToCSV);

export default router;
