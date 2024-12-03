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

router.get("", authMiddleware, getReports);
router.post("", authMiddleware, generateReport);
router.delete("/:id", authMiddleware, deleteReport);

router.get("/:id/export", authMiddleware, exportReportToCSV);

export default router;
