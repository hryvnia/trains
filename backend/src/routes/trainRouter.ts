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

router.get("", getTrains);
router.post("", authMiddleware, createTrain);

router.patch("/:id", authMiddleware, updateTrain);
router.delete("/:id", authMiddleware, deleteTrain);

export default router;
