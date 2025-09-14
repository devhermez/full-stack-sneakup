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

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Health
app.get("/", (_req: Request, res: Response) => res.send("Sneak Up API is running"));
app.get("/healthz", (_req, res) => res.status(200).json({ ok: true }));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL || "",
  process.env.APP_RUNNER_URL || "",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS")),
    credentials: true,
  })
);

// Stripe webhook (raw body BEFORE json)
app.post("/api/webhook", bodyParser.raw({ type: "application/json" }), handleStripeWebhook);

// JSON for other routes
app.use(express.json());

// Dev logging
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan") as typeof import("morgan");
  app.use(morgan("dev"));
}

// Rate limit
app.use("/api", apiLimiter);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);



// Mongo connection (no hard exit)
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set");
}

async function connectWithRetry(uri: string, retries = 10, delayMs = 3000) { // <- accept string
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(uri);
      console.log("Connected to MongoDB");
      return;
    } catch (err) {
      console.error(`Mongo connect attempt ${i} failed:`, (err as Error).message);
      if (i === retries) {
        console.error("Proceeding without DB connection; DB-backed routes will error until connectivity is fixed.");
        return;
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
connectWithRetry(MONGO_URI); // <- pass narrowed string

const PORT = Number(process.env.PORT)
const safePort = Number.isFinite(PORT) && PORT > 0 ? PORT : 8080;
const server = app.listen(safePort, "0.0.0.0", () =>
  console.log(`Server listening on ${safePort}`)
);

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log("Mongo connection closed");
    } catch (e) {
      console.error("Error closing Mongo connection:", (e as Error).message);
    } finally {
      process.exit(0);
    }
  });
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export default app;