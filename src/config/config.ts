import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  mongodb: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/event-management",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expire: process.env.JWT_EXPIRE || "7d",
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@eventmanagement.com",
  },
};
