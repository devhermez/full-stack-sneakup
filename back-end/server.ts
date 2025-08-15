// server.ts
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";

import { apiLimiter } from "./middleware/rateLimitMiddleware";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import { handleStripeWebhook } from "./controllers/orderController";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-sneak-up.vercel.app",
] as const;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin as (typeof allowedOrigins)[number])) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Stripe webhook must receive the raw body BEFORE express.json()
app.post(
  "/api/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook // ensure this is typed as express.RequestHandler in your controller
);

// JSON parser for the rest of the routes
app.use(express.json());

// Use morgan only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Global rate limiting for all /api endpoints
app.use("/api", apiLimiter);

// Routes
app.use("/api/products", productRoutes);
console.log("Mounted: /api/products");
app.use("/api/users", userRoutes);
console.log("Mounted: /api/users");
app.use("/api/orders", orderRoutes);
console.log("Mounted: /api/orders");

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("Sneak Up API is running");
});

// Mongo connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("MONGO_URI is not set in environment variables");
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));

// (optional) export for testing
export default app;