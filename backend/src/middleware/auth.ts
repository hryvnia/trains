import jwt, { JwtPayload as JwtPayloadDefault } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload extends JwtPayloadDefault {
  id: string;
}

// Розширений інтерфейс для запиту, що включає користувача
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Мідлвар для аутентифікації користувача через JWT
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    // Перевірка токена за допомогою секретного ключа
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // Якщо структура правильна, додаємо токен в req.user
    if (typeof decoded === "object" && "id" in decoded) {
      req.user = decoded as JwtPayload;
      next();
    } else {
      res.status(401).json({ message: "Invalid token structure" });
    }
  } catch (error) {
    // У разі помилки повертаємо статус 401
    res.status(401).json({ message: "Token is not valid" });
  }
};
