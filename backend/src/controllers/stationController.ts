import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Station from "../models/Station";

// Отримання станцій
export const getStations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stations = await Station.find({});
    res.json(stations.map((s) => s));
  } catch (error) {
    next(error);
  }
};
