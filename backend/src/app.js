import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

// Routes import
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import roleRouter from "./routes/role.routes.js";
import incidentRouter from "./routes/incident.routes.js";
import taskRouter from "./routes/task.routes.js";
import evidenceRouter from "./routes/evidence.routes.js";
import timelineRouter from "./routes/timeline.routes.js";
import playbookRouter from "./routes/playbook.routes.js";
import auditRouter from "./routes/audit.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://ricoz-respond.vercel.app"
];

if (process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN.split(",").forEach((origin) => {
    const trimmed = origin.trim().replace(/\/+$/, "");
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes("*") ||
        /^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/uploads", express.static(path.resolve("uploads")));

// Health check endpoint
app.get(["/health", "/api/health"], (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ status: "online", service: "RicozRespond API" });
});

// Mount /api routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/evidence", evidenceRouter);
app.use("/api/timeline", timelineRouter);
app.use("/api/playbooks", playbookRouter);
app.use("/api/audit-logs", auditRouter);
app.use("/api/dashboard", dashboardRouter);

// Also mount direct routes without /api prefix for resiliency if VITE_API_URL lacks /api
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/incidents", incidentRouter);
app.use("/tasks", taskRouter);
app.use("/evidence", evidenceRouter);
app.use("/timeline", timelineRouter);
app.use("/playbooks", playbookRouter);
app.use("/audit-logs", auditRouter);
app.use("/dashboard", dashboardRouter);

// Also mount /api/v1 routes for full compatibility
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/incidents", incidentRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/evidence", evidenceRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/playbooks", playbookRouter);
app.use("/api/v1/audit-logs", auditRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
