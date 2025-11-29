import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/config";

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Generate a JWT token
 */
export const generateToken = (userId: string): string => {
  const payload = { id: userId };
  const secret = config.jwt.secret as string;
  const options = {
    expiresIn: config.jwt.expire,
  };
  return jwt.sign(payload, secret, options as SignOptions);
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwt.secret as string);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
