import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Train from "../models/Train";
import { AuthRequest } from "../middleware/auth";

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
      _id: undefined, // Удаляем поле _id
    }));
    res.json(transformedTrains);
  } catch (error) {
    next(error);
  }
};

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

  const { id } = req.params; // Получаем ID поезда из URL
  const { number, route } = req.body; // Данные для обновления

  try {
    // Находим поезд по ID
    const train = await Train.findById(id);
    if (!train) {
      res.status(404).json({ message: "Train not found" });
      return;
    }

    // Обновляем поля, если они переданы
    if (number !== undefined) train.number = number;
    if (route !== undefined) train.route = route;

    // Сохраняем изменения
    await train.save();

    res.json(train); // Возвращаем обновленный объект
  } catch (error) {
    next(error);
  }
};