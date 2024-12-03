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

router.get("", authMiddleware, getSchedules);
router.post("", authMiddleware, createSchedule);
router.patch("/:id", authMiddleware, updateSchedule);
router.delete("/:id", authMiddleware, deleteSchedule);

router.get("/stats/:date", getScheduleStats);

export default router;
