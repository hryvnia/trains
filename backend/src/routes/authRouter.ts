import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { login, register } from "../controllers/userController";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Маршрут для реєстрації нового користувача
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("username", "Please include a valid username").exists(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  register
);

// Маршрут для логіну користувача
router.post(
  "/login",
  [
    check("username", "Please include a valid username").exists(),
    check("password", "Password is required").exists(),
  ],
  login
);

export default router;
