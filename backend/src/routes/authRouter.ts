import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import { login, register } from "../controllers/userController";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("username", "Please include a valid email").exists(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  register
);

router.post(
  "/login",
  [
    check("username", "Please include a valid email").exists(),
    check("password", "Password is required").exists(),
  ],
  login
);

router.get("/protected", authMiddleware, (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.json({ message: "This is a protected route", userId: req.user.id });

    //
  } else {
    res.status(401).json({ message: "No user found in token" });
  }
});

export default router;
