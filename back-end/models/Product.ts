import mongoose, { Document, Schema } from "mongoose";

// --- Interface ---
export interface IProduct extends Document {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  gender: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Schema ---
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

// --- Model ---
const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;