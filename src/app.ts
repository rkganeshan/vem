import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API welcome
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Virtual Event Management Platform API",
    version: "1.0.0",
    description: "A robust backend system for managing virtual events with user authentication, event scheduling, and participant management",
    documentation: {
      endpoints: {
        health: "/health",
        auth: {
          register: "POST /api/auth/register",
          login: "POST /api/auth/login",
          profile: "GET /api/auth/me"
        },
        events: {
          list: "GET /api/events",
          get: "GET /api/events/:id",
          create: "POST /api/events",
          update: "PUT /api/events/:id",
          delete: "DELETE /api/events/:id",
          register: "POST /api/events/:id/register",
          unregister: "DELETE /api/events/:id/register",
          myEvents: "GET /api/events/my-events"
        }
      },
      repository: "https://github.com/your-username/vem",
      contact: "support@example.com"
    },
    status: "Production Ready",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
