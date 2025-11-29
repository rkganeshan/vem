import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { verifyToken } from "../utils/auth.utils";
import { AuthenticationError } from "../utils/errors";

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Authentication middleware to protect routes
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      throw new AuthenticationError("Invalid or expired token");
    }

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
