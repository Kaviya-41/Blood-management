// backend/app.js — Express app (works on Render as a web service AND locally)
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import { swaggerUi, swaggerDocs } from "./openapi/index.js";
import bloodLabRoutes from "./routes/bloodLabRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,          // your Vercel URL e.g. https://blood-management.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, Render health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any *.vercel.app preview deployments
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      // Allow any *.onrender.com subdomain (Render preview URLs)
      if (/\.onrender\.com$/.test(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blood-lab", bloodLabRoutes);
app.use("/api/hospital", hospitalRoutes);

// ─── Health check (Render pings this to keep the service alive) ──────────────
app.get("/", (_req, res) => res.json({ status: "Blood Bank API is running 🚀" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ─── DB Connection ────────────────────────────────────────────────────────────
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1); // crash hard so Render restarts the service
  }
};

export default app;
