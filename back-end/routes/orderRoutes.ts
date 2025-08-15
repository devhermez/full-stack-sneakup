// src/routes/orderRoutes.ts
import express, { Router } from "express";
import {
  createCheckoutSession,
  addOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from "../controllers/orderController";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = express.Router();

// Public routes for logged-in users
router.post("/", protect, addOrder);
router.get("/user", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

// Admin route
router.get("/", protect, admin, getAllOrders);

// Update payment/delivery status
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

// Stripe checkout
router.post("/:id/create-checkout-session", protect, createCheckoutSession);

export default router;