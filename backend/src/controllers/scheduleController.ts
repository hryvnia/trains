import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import Schedule from "../models/Schedule";
import { AuthRequest } from "../middleware/auth";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const tz = "Europe/Kyiv";

// Отримання всіх розкладів
export const getSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schedules = await Schedule.find({})
      .populate("train")
      .populate("station");

    res.json(schedules);
  } catch (error) {
    next(error);
  }
};

// Створення нового розкладу
export const createSchedule = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "No user found in token" });
    return;
  }

  const { train_id, station_id, arrivalTime, departureTime, platform } =
    req.body;

  if (!train_id || !station_id || !platform) {
    res.status(400).json({
      message: "Missing required fields: train_id, station_id, or platform",
    });
    return;
  }

  if (!arrivalTime && !departureTime) {
    res.status(400).json({
      message: "Either 'arrivalTime' or 'departureTime' must be provided",
    });
    return;
  }

  try {
    const schedule = await Schedule.create({
      train_id,
      station_id,
      arrivalTime,
      departureTime,
      platform,
    });

    if (!schedule) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

// Оновлення існуючого розкладу
export const updateSchedule = async (
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
  const {
    train_id,
    station_id,
    arrivalTime,
    departureTime,
    platform,
    delay_minutes,
  } = req.body;

  if (!train_id || !station_id || !platform) {
    res.status(400).json({
      message: "Missing required fields: train_id, station_id, or platform",
    });
    return;
  }

  if (!arrivalTime && !departureTime) {
    res.status(400).json({
      message: "Either 'arrivalTime' or 'departureTime' must be provided",
    });
    return;
  }

  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    if (
      arrivalTime === null &&
      departureTime === null &&
      !schedule.arrivalTime &&
      !schedule.departureTime
    ) {
      res.status(400).json({
        message: "Either 'arrivalTime' or 'departureTime' must be provided",
      });
      return;
    }

    if (train_id !== undefined) schedule.train_id = train_id;
    if (station_id !== undefined) schedule.station_id = station_id;
    if (arrivalTime !== undefined) schedule.arrivalTime = arrivalTime;
    if (departureTime !== undefined) schedule.departureTime = departureTime;
    if (platform !== undefined) schedule.platform = platform;
    if (delay_minutes !== undefined) schedule.delay_minutes = delay_minutes;

    await schedule.save();

    res.json(schedule);
  } catch (error) {
    next(error);
  }
};

// Видалення розкладу
export const deleteSchedule = async (
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
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    await schedule.deleteOne();

    res.json({ message: "success" });
    return;
  } catch (error) {
    next(error);
  }
};

// Отримання статистики розкладів за конкретну дату
export const getScheduleStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date } = req.params;

    const startDate = dayjs.tz(date, tz).startOf("day").toDate();
    const endDate = dayjs.tz(date, tz).endOf("day").toDate();

    console.log(startDate, endDate);

    const stats = await Schedule.aggregate([
      {
        $match: {
          $or: [
            { arrivalTime: { $gte: startDate, $lte: endDate } },
            { departureTime: { $gte: startDate, $lte: endDate } },
          ],
        },
      },
      {
        $addFields: {
          hourArrival: {
            $cond: [
              { $ne: ["$arrivalTime", null] },
              {
                $convert: {
                  input: {
                    $substr: [
                      {
                        $dateToString: {
                          date: "$arrivalTime",
                          timezone: tz,
                          format: "%H",
                        },
                      },
                      0,
                      2,
                    ],
                  },
                  to: "int",
                  onError: null,
                },
              },
              null,
            ],
          },
          hourDeparture: {
            $cond: [
              { $ne: ["$departureTime", null] },
              {
                $convert: {
                  input: {
                    $substr: [
                      {
                        $dateToString: {
                          date: "$departureTime",
                          timezone: tz,
                          format: "%H",
                        },
                      },
                      0,
                      2,
                    ],
                  },
                  to: "int",
                  onError: null,
                },
              },
              null,
            ],
          },
        },
      },
      {
        $facet: {
          arrivals: [
            { $match: { hourArrival: { $ne: null } } },
            {
              $group: {
                _id: "$hourArrival",
                details: { $push: "$$ROOT" },
              },
            },
          ],
          departures: [
            { $match: { hourDeparture: { $ne: null } } },
            {
              $group: {
                _id: "$hourDeparture",
                details: { $push: "$$ROOT" },
              },
            },
          ],
        },
      },
    ]);

    const fullStats = Array.from({ length: 24 }, (_, hour) => {
      const arrivals =
        stats[0]?.arrivals
          .find((a: any) => a._id === hour)
          ?.details.filter((a: any) => a !== null) || [];
      const departures =
        stats[0]?.departures
          .find((d: any) => d._id === hour)
          ?.details.filter((d: any) => d !== null) || [];

      return {
        hour,
        arrivals,
        departures,
      };
    });

    res.status(200).json(fullStats);
  } catch (error) {
    console.error("Error fetching schedule stats:", error);
    next(error);
  }
};
