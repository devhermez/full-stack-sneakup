import { Request, Response } from "express";
import Product from "../models/Product";

// AI-server
export const getProductsById = async (req: Request, res: Response) => {
  try {
    const ids = req.body.ids as string[];
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or empty ids" });
    }
    const products = await Product.find({ _id: { $in: ids } });
    return res.json(products);
  } catch (err) {
    console.error("Error fetching by IDs", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /api/products
export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    return product
      ? res.json(product)
      : res.status(404).json({ message: "Product not found" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

// POST /api/products (Admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const product = new Product({
      name: "Sample Product",
      price: 0,
      description: "Sample Description",
      images: ["/images/sample.jpg"],
      brand: "Sample Brand",
      category: "Sample Category",
      stock: 0,
      sizes: ["US 8"],
      gender: "Unisex",
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Product creation failed", error: error.message });
  }
};

// PUT /api/products/:id (Admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      images,
      brand,
      category,
      stock,
      sizes,
      gender,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.images = images ?? product.images;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.sizes = sizes ?? product.sizes;
    product.gender = gender ?? product.gender;

    const updatedProduct = await product.save();
    return res.json(updatedProduct);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Product update failed", error: error.message });
  }
};

// DELETE /api/products/:id (Admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne(); // Mongoose 8-friendly
    return res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Product deletion failed", error: error.message });
  }
};
