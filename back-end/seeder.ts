// seeder.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// NOTE: update these import paths to match your actual TS model filenames
import Product from "./models/Product";
import User from "./models/User";
import Order from "./models/Order";

dotenv.config();

// ---- Types just for the seed arrays (kept simple) ----
interface UserSeed {
  name: string;
  email: string;
  password: string; // already hashed
  role: "admin" | "user";
}

interface ProductSeed {
  name: string;
  description: string;
  brand: string;
  category: string;
  gender: "Men" | "Women" | "Unisex";
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
}

// ---- DB Connect ----
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not set in your environment.");
    process.exit(1);
  }

  try {
    // Mongoose v7/8 no longer needs useNewUrlParser/useUnifiedTopology
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", (err as Error).message);
    process.exit(1);
  }
}

// ---- Seed Data ----
const users: UserSeed[] = [
  {
    name: "Admin User",
    email: "admin@sneakup.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin" as const,
  },
  {
    name: "John Runner",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Jane Hooper",
    email: "jane@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Mike Sneakerhead",
    email: "mike@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Sarah Walker",
    email: "sarah@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "David Hoops",
    email: "david@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Emily Strider",
    email: "emily@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Chris Trainer",
    email: "chris@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Laura Jogger",
    email: "laura@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
  {
    name: "Alex Street",
    email: "alex@example.com",
    password: bcrypt.hashSync("password123", 10),
    role: "user" as const,
  },
];

const products: ProductSeed[] = [
  {
    name: "Nike Air Max 270",
    description: "Breathable mesh upper with Max Air cushioning.",
    brand: "Nike",
    category: "Basketball Shoes",
    gender: "Men",
    price: 139.99,
    stock: 25,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax270-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax270-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax270-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Nike Air Force 1 Low",
    description: "Classic leather upper with timeless style.",
    brand: "Nike",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 109.99,
    stock: 40,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airforce1low-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airforce1low-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airforce1low-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "New Balance 990v5",
    description: "Premium suede and mesh with ENCAP midsole.",
    brand: "New Balance",
    category: "Running Shoes",
    gender: "Men",
    price: 184.99,
    stock: 15,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-990v5-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-990v5-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-990v5-3.png",
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
  },
  {
    name: "Converse Chuck 70",
    description: "Vintage canvas with premium details.",
    brand: "Converse",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 74.99,
    stock: 50,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/converse-chuck70-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/converse-chuck70-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/converse-chuck70-3.png",
    ],

    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Vans Old Skool",
    description: "Classic skate style with durable suede canvas.",
    brand: "Vans",
    category: "Skate Shoes",
    gender: "Unisex",
    price: 64.99,
    stock: 35,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/vans-oldskool-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/vans-oldskool-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/vans-oldskool-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Nike ZoomX Vaporfly Next%",
    description: "Elite racing shoe with carbon plate propulsion.",
    brand: "Nike",
    category: "Running Shoes",
    gender: "Men",
    price: 249.99,
    stock: 10,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-vaporfly-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-vaporfly-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-vaporfly-3.png",
    ],
    sizes: ["US 8", "US 9", "US 10"],
  },
  {
    name: "Adidas Superstar",
    description: "Iconic shell-toe design with leather upper.",
    brand: "Adidas",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 84.99,
    stock: 45,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-superstar-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-superstar-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-superstar-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9"],
  },
  {
    name: "Asics Gel-Kayano 28",
    description: "Stability running shoe with GEL technology.",
    brand: "Asics",
    category: "Running Shoes",
    gender: "Men",
    price: 159.99,
    stock: 18,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelkayano28-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelkayano28-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelkayano28-3.png",
    ],

    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Reebok Club C 85",
    description: "Minimalist leather tennis-inspired silhouette.",
    brand: "Reebok",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 74.99,
    stock: 22,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-club85-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-club85-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-club85-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9"],
  },
  {
    name: "Nike Blazer Mid '77",
    description: "Vintage mid-cut design with suede accents.",
    brand: "Nike",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 99.99,
    stock: 28,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-blazermid77-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-blazermid77-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-blazermid77-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Adidas NMD_R1",
    description: "Street-ready Boost comfort with modern styling.",
    brand: "Adidas",
    category: "Casual Sneakers",
    gender: "Men",
    price: 139.99,
    stock: 32,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-nmdr1-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-nmdr1-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-nmdr1-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Under Armour HOVR Phantom 2",
    description: "Plush UA HOVR cushioning with sock-like fit.",
    brand: "Under Armour",
    category: "Running Shoes",
    gender: "Men",
    price: 139.99,
    stock: 16,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-phantom2-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-phantom2-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-phantom2-3.png",
    ],
    sizes: ["US 8", "US 9", "US 10"],
  },
  {
    name: "Saucony Jazz Original",
    description: "Retro nylon-suede runner with classic look.",
    brand: "Saucony",
    category: "Running Shoes",
    gender: "Unisex",
    price: 79.99,
    stock: 24,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/saucony-jazz-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/saucony-jazz-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/saucony-jazz-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9"],
  },
  {
    name: "Fila Disruptor II",
    description: "Chunky '90s-inspired silhouette with bold sole.",
    brand: "Fila",
    category: "Casual Sneakers",
    gender: "Women",
    price: 69.99,
    stock: 30,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/fila-disaster2-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/fila-disaster2-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/fila-disaster2-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9"],
  },
  {
    name: "NikeJordan 1 Mid",
    description: "Classic silhouette with modern colorways.",
    brand: "Nike",
    category: "Basketball Shoes",
    gender: "Men",
    price: 124.99,
    stock: 20,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-jordan1mid-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-jordan1mid-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-jordan1mid-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Nike React Infinity Run Flyknit 3",
    description: "Highly cushioned, stable everyday trainer.",
    brand: "Nike",
    category: "Running Shoes",
    gender: "Men",
    price: 159.99,
    stock: 25,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-reactinfinityrunflyknit3-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-reactinfinityrunflyknit3-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-reactinfinityrunflyknit3-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Nike Dunk Low",
    description: "Retro basketball style for everyday wear.",
    brand: "Nike",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 109.99,
    stock: 30,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-dunklow-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-dunklow-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-dunklow-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10"],
  },
  {
    name: "Adidas Gazelle",
    description: "Classic suede low-top with iconic stripes.",
    brand: "Adidas",
    category: "Casual Sneakers",
    gender: "Unisex",
    price: 89.99,
    stock: 25,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-gazelle-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-gazelle-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-gazelle-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9"],
  },
  {
    name: "Reebok Nano X3",
    description: "Training shoe built for performance and comfort.",
    brand: "Reebok",
    category: "Training Shoes",
    gender: "Men",
    price: 129.99,
    stock: 20,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-nanox3-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-nanox3-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/reebok-nanox3-3.png",
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
  },
  {
    name: "Under Armour Curry Flow 10",
    description: "Lightweight basketball shoes with superior grip.",
    brand: "Under Armour",
    category: "Basketball Shoes",
    gender: "Men",
    price: 159.99,
    stock: 18,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-curryflow10-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-curryflow10-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/ua-curryflow10-3.png",
    ],
    sizes: ["US 8", "US 9", "US 10"],
  },
  {
    name: "Nike Pegasus 40",
    description: "Everyday responsive running comfort.",
    brand: "Nike",
    category: "Running Shoes",
    gender: "Men",
    price: 139.99,
    stock: 20,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-peasus40-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-peasus40-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-peasus40-3.png",
    ],
    sizes: ["US 7", "US 8", "US 9"],
  },
  {
    name: "Nike Air Max 90 SE",
    description: "Stylish and comfortable design tailored for women.",
    brand: "Nike",
    category: "Casual Sneakers",
    gender: "Women",
    price: 129.99,
    stock: 20,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax90se-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax90se-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/nike-airmax90se-3.png",
    ],
    sizes: ["US 5", "US 6", "US 7", "US 8"],
  },
  {
    name: "Adidas Ultraboost 22",
    description: "Responsive running shoe for the female stride.",
    brand: "Adidas",
    category: "Running Shoes",
    gender: "Women",
    price: 179.99,
    stock: 25,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-ultaboost22-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-ultaboost22-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/adidas-ultaboost22-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9"],
  },
  {
    name: "Asics Gel-Nimbus 25",
    description: "Ultra-cushioned trainer built for women’s comfort",
    brand: "Asics",
    category: "Running Shoes",
    gender: "Women",
    price: 159.99,
    stock: 18,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelnimbus25-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelnimbus25-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/asics-gelnimbus25-3.png",
    ],
    sizes: ["US 6", "US 7", "US 8", "US 9"],
  },
  {
    name: "New Balance 574 Core",
    description: "Iconic retro silhouette in a women’s colorway.",
    brand: "New Balance",
    category: "Casual Sneakers",
    gender: "Women",
    price: 89.99,
    stock: 22,
    images: [
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-574core-1.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-574core-2.png",
      "https://s3.ap-southeast-2.amazonaws.com/sneakup-images/newbalance-574core-3.png",
    ],
    sizes: ["US 5", "US 6", "US 7", "US 8"],
  },
  // ... keep the rest of your product objects exactly as in your JS file ...
];

// ---- Seeder ----
async function importData() {
  try {
    await connectDB();

    


    // Clear existing
    await Product.deleteMany({});
    console.log("🧹 Existing products removed");

    await User.deleteMany({});
    console.log("🧹 Existing users removed");

    await Order.deleteMany({});
    console.log("🧹 Deleted existing order");

    // Insert fresh
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    await User.insertMany(users);
    console.log(`✅ Inserted ${users.length} users`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", (err as Error).message);
    process.exit(1);
  }
}

// Run it
importData();
