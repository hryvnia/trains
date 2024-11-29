import jwt, { JwtPayload as JwtPayloadDefault } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload extends JwtPayloadDefault {
  id: string; // Добавляем свойство id
}

export interface AuthRequest extends Request {
  user?: JwtPayload; // Обновляем тип
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Извлечение токена

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Проверка, что декодированный токен - это объект с полем id
    if (typeof decoded === "object" && "id" in decoded) {
      req.user = decoded as JwtPayload; // Приведение к типу JwtPayload
      next(); // Передача управления дальше
    } else {
      res.status(401).json({ message: "Invalid token structure" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
