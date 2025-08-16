import type { User } from "./User";
import type { Product } from "./Product";

export interface OrderItem {
  product: string | Product; // can be just product ID or populated product
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}

export interface Order {
  _id: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  itemsPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  paymentResult?: PaymentResult;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}