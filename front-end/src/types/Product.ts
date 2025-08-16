export interface Product {
  _id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  images: string[];   // array of image URLs
  sizes: string[];    // array of available sizes
  gender: "male" | "female" | "unisex";
  createdAt?: string;
  updatedAt?: string;
}