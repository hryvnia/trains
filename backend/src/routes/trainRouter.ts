import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  createTrain,
  getTrains,
  updateTrain,
} from "../controllers/trainController";

const router = express.Router();

router.get("", getTrains);
router.post("", authMiddleware, createTrain);
router.patch("/:id", authMiddleware, updateTrain);

export default router;
