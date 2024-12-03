import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware, AuthRequest } from "../middleware/auth";
import { getStations } from "../controllers/stationController";

const router = express.Router();

router.get("", getStations);

export default router;
