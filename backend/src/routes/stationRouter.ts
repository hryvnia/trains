import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { getStations } from "../controllers/stationController";

const router = express.Router();

// Маршрут для отримання всіх станцій
router.get("", getStations);

export default router;
