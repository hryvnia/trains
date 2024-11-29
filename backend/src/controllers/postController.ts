import express, { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
// убедитесь, что путь правильный
import Post from "../models/Post";
import { AuthRequest } from "../middleware/auth";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const posts = await Post.find({}).lean();
    const transformedPosts = posts.map((post) => ({
      ...post,
      id: post._id,
      _id: undefined, // Удаляем поле _id
    }));
    res.json(transformedPosts);
  } catch (error) {
    next(error);
  }
};

// Контроллер для логина
export const createPost = async (
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

  const { title, content } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
    });

    if (!post) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};
