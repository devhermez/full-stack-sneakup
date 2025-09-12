// server.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";

import { apiLimiter } from "./middleware/rateLimitMiddleware";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import { handleStripeWebhook } from "./controllers/orderController";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// ----- Security headers -----
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// ----- CORS (env-driven) -----
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL!,         // e.g., https://sneakup.vercel.app
  process.env.CLIENT_URL_ALT || "", // optional www/apex
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
    credentials: true,
  })
);

// ----- Stripe webhook must get raw body BEFORE express.json() -----
app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), handleStripeWebhook);

// JSON parser for the rest
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan") as typeof import("morgan");
  app.use(morgan("dev"));
}

// Rate limit for /api
app.use("/api", apiLimiter);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Health checks
app.get("/", (_req: Request, res: Response) => res.send("Sneak Up API is running"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// Mongo connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is not set");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = Number(process.env.PORT) || 5001;
const server = app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// ----- Graceful shutdown -----
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down...`);
  server.close(() => console.log("HTTP server closed"));
  await mongoose.connection.close();
  process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// (optional) export for testing
export default app;