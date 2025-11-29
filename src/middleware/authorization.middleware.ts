import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/User";
import { AuthorizationError } from "../utils/errors";

/**
 * Authorization middleware to check user roles
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError("User not authenticated");
      }

      if (!roles.includes(req.user.role)) {
        throw new AuthorizationError(
          `User role '${req.user.role}' is not authorized to access this route`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
