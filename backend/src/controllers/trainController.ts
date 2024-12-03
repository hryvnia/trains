import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Train from "../models/Train";
import { AuthRequest } from "../middleware/auth";
import axios, { isAxiosError } from "axios";
import puppeteer from "puppeteer";

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
  console.log(1);

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

export const parseUZ = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    };

    try {
      const browser = await puppeteer.launch({
        headless: false, // Установите false, чтобы видеть процесс (опционально)
      });
      const page = await browser.newPage();

      // Перейдите на защищенную страницу
      await page.goto("https://booking.uz.gov.ua/schedule", {
        waitUntil: "networkidle2",
      });

      // Дождитесь загрузки страницы
      console.log("Page loaded.");

      // Получите cookies
      const cookies = await page.cookies();
      console.log("Cookies:", cookies);

      // Получите заголовки запроса
      const headers = await page.evaluate(() => {
        return JSON.stringify({
          "user-agent": navigator.userAgent,
          "accept-language": navigator.language,
        });
      });

      console.log("Headers:", JSON.parse(headers));

      // const { data } = await axios.get(
      //   "https://app.uz.gov.ua/api/station-boards/2204001",
      //   {
      //     headers: JSON.parse(headers),
      //   }
      // );

      // console.log(data);

      // Закройте браузер
      await browser.close();
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err.code, err.status);
        console.log(err.response?.headers);
      }
    }
    res.json({});
  } catch (error) {
    next(error);
  }
};
