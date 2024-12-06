import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Train from "../models/Train";
import { AuthRequest } from "../middleware/auth";
import axios, { isAxiosError } from "axios";

// Отримання всіх поїздів
export const getTrains = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trains = await Train.find({}).lean();
    const transformedTrains = trains.map((train) => ({
      ...train,
      id: train._id,
      _id: undefined, // Удаляємо поле _id
    }));
    res.json(transformedTrains);
  } catch (error) {
    next(error);
  }
};

// Створення нового поїзда
export const createTrain = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { number, route } = req.body;

  try {
    const train = await Train.create({
      number,
      route,
    });

    if (!train) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json(train);
  } catch (error) {
    next(error);
  }
};

// Оновлення інформації про поїзд
export const updateTrain = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  const { number, route } = req.body;

  try {
    const train = await Train.findById(id);
    if (!train) {
      res.status(404).json({ message: "Train not found" });
      return;
    }

    if (number !== undefined) train.number = number;
    if (route !== undefined) train.route = route;

    await train.save();

    res.json(train);
  } catch (error) {
    next(error);
  }
};

// Видалення поїзда
export const deleteTrain = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { id } = req.params;
  try {
    const train = await Train.findById(id);

    if (!train) {
      res.status(404).json({ message: "Поезд не найден" });
      return;
    }

    await train.deleteOne();

    res.json({ message: "success" });
    return;
  } catch (error) {
    next(error);
  }
};
