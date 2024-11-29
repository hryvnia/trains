import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

import { authMiddleware, AuthRequest } from "../middleware/auth";
import { createPost, getPosts } from "../controllers/postController";

const router = express.Router();

router.get("", getPosts);
router.post("", authMiddleware, createPost);

export default router;
