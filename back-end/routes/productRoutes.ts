// src/routes/productRoutes.ts
import express, { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsById,
} from "../controllers/productController";
import { protect, admin } from "../middleware/authMiddleware";

const router: Router = express.Router();

// @route   GET /api/products
router.get("/", getProducts);

// @route   GET /api/products/:id
router.get("/:id", getProductById);

// Admin CRUD Routes
router.put("/:id", protect, admin, updateProduct);
router.post("/", protect, admin, createProduct);
router.delete("/:id", protect, admin, deleteProduct);

// AI-server related
router.post("/by-ids", getProductsById);

export default router;