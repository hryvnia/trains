import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Report from "../models/Report";
import Schedule from "../models/Schedule";

import { Parser } from "json2csv";

import { AuthRequest } from "../middleware/auth";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Europe/Kyiv";

// Отримання всіх звітів для користувача або всіх звітів, якщо вказано параметр `all=true`
export const getReports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }
  try {
    const reports = await Report.find(
      req.query.all === "true" ? {} : { user_id: req.user.id }
    )
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password",
      });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

// Генерація звіту за заданими датами
export const generateReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    res
      .status(400)
      .json({ message: "Missing required fields: startDate or endDate" });
    return;
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const schedules = await Schedule.find({
      $or: [
        { arrivalTime: { $gte: start, $lte: end } },
        { departureTime: { $gte: start, $lte: end } },
      ],
    })
      .populate("train")
      .populate("station");

    const scheduleData = schedules.map((schedule) =>
      schedule.toObject({ virtuals: true })
    );

    const report = await Report.create({
      user_id: req.user.id,
      startDate: start,
      endDate: end,
      data: scheduleData,
    });

    res.json(report);
  } catch (error) {
    next(error);
  }
};

// Видалення звіту
export const deleteReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    if (report.user_id.toString() !== req.user.id.toString()) {
      res
        .status(403)
        .json({ message: "Forbidden: You cannot delete this report" });
      return;
    }

    await report.deleteOne();

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Експорт звіту у CSV
export const exportReportToCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    // Підготовка даних для CSV
    const fields = [
      "train.number",
      "station.name",
      "arrivalTime",
      "departureTime",
      "platform",
      "delay_minutes",
    ];
    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(report.data);

    // Встановлення заголовків відповіді для завантаження файлу
    res.header("Content-Type", "text/csv");
    res.attachment(`report_${report._id}.csv`);
    res.send(csv);
    return;
  } catch (error) {
    next(error);
  }
};
