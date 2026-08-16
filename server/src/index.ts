import { env } from "./env.js";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
const PORT = env.PORT;

// Middleware
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      message: "Spiceey API Server is running",
      version: "1.0.0",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// Global error handler (Express v5)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("[Global Error]", err);
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT}`);
});
