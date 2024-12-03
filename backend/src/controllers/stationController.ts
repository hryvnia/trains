import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Station from "../models/Station";
import { AuthRequest } from "../middleware/auth";
import axios, { isAxiosError } from "axios";
import puppeteer from "puppeteer";

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

// export const createStation = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   if (!req.user) {
//     res.status(401).json({ message: "No user found in token" });
//     return;
//   }

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ errors: errors.array() });
//     return;
//   }

//   const { number, route } = req.body;

//   try {
//     const train = await Train.create({
//       number,
//       route,
//     });

//     if (!train) {
//       res.status(400).json({ message: "Invalid credentials" });
//       return;
//     }

//     res.json(train);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateTrain = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   if (!req.user) {
//     res.status(401).json({ message: "No user found in token" });
//     return;
//   }

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ errors: errors.array() });
//     return;
//   }
//   console.log(1);

//   const { id } = req.params; // Получаем ID поезда из URL
//   const { number, route } = req.body; // Данные для обновления

//   try {
//     // Находим поезд по ID
//     const train = await Train.findById(id);
//     if (!train) {
//       res.status(404).json({ message: "Train not found" });
//       return;
//     }

//     // Обновляем поля, если они переданы
//     if (number !== undefined) train.number = number;
//     if (route !== undefined) train.route = route;

//     // Сохраняем изменения
//     await train.save();

//     res.json(train); // Возвращаем обновленный объект
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteTrain = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   if (!req.user) {
//     res.status(401).json({ message: "No user found in token" });
//     return;
//   }

//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     res.status(400).json({ errors: errors.array() });
//     return;
//   }

//   const { id } = req.params;
//   try {
//     const train = await Train.findById(id);

//     if (!train) {
//       res.status(404).json({ message: "Поезд не найден" });
//       return;
//     }

//     await train.deleteOne();

//     res.json({ message: "success" });
//     return;
//   } catch (error) {
//     next(error);
//   }
// };