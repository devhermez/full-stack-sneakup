import type { RequestHandler } from "express";
import Stripe from "stripe";
import Order from "../models/Order";
import User from "../models/User";
import { sendEmail } from "../utils/sendEmail";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

if (!STRIPE_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
if (!CLIENT_URL) throw new Error("CLIENT_URL is not set");

const stripe = new Stripe(STRIPE_KEY);

export const createCheckoutSession: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate<{ user: { email: string; _id: any } }>(
      "user",
      "email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user && String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.user.email,
      line_items: order.orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      })),
      // 🔧 Use order.id (string getter), not order._id
      success_url: `${CLIENT_URL}/order/${order.id}?success=true`,
      cancel_url: `${CLIENT_URL}/placeorder?canceled=true`,
      // 🔧 Pass a string id directly
      metadata: { orderId: order.id },
    });

    if (!session.url) {
      return res.status(500).json({ message: "Stripe did not return a checkout URL" });
    }

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    return res.status(500).json({ message: "Stripe session creation error", error: error.message });
  }
};

// POST /api/webhook (raw body applied in server.ts for this route)
export const handleStripeWebhook: RequestHandler = async (req, res) => {
  if (!STRIPE_WEBHOOK_SECRET) return res.status(400).send("Missing STRIPE_WEBHOOK_SECRET");

  const sig = req.headers["stripe-signature"] as string | undefined;
  if (!sig) return res.status(400).send("Missing stripe-signature header");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return res.status(400).send(`Webhook error: ${err?.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order) {
          if (order.isPaid) {
          return res.status(200).json({ received: true, note: "already paid" });
        }
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult = {
            id: session.payment_intent as string,
            status: session.status ?? "completed",
            email_address: session.customer_email ?? undefined,
          };
          await order.save();
          console.log(`Order ${orderId} marked as paid.`);
        }
      } catch (e) {
        console.error("Failed to update order payment status:", e);
      }
    }
  }

  return res.status(200).json({ received: true });
};

// POST /api/orders (Private)
export const addOrder: RequestHandler = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    const { orderItems, shippingAddress, itemsPrice, totalPrice } = req.body;
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    const user = await User.findById(req.user._id);
    if (user) {
      const orderSummary = createdOrder.orderItems
        .map((item) => `- ${item.name} (x${item.quantity}, Size: ${item.size}) - $${item.price.toFixed(2)}`)
        .join("\n");

      const emailMessage = `Hello ${user.name},

Thank you for shopping with SneakUp!

Your order has been placed successfully.

🛒 Order Details:
${orderSummary}

📦 Shipping Address:
${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}

💰 Total: $${totalPrice}

We will notify you once your order is shipped.

– SneakUp Team
`;
      await sendEmail({ to: user.email, subject: "SneakUp Order Confirmation", text: emailMessage });
    }

    return res.status(201).json(createdOrder);
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/orders/:id (Private)
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    return order ? res.json(order) : res.status(404).json({ message: "Order not found" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/orders/user (Private)
export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.product", "name price");
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET /api/orders (Admin)
export const getAllOrders: RequestHandler = async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    return res.json(orders);
  } catch (error: any) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// PUT /api/orders/:id/pay (Private)
export const updateOrderToPaid: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/orders/:id/deliver (Admin)
export const updateOrderToDelivered: RequestHandler = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isDelivered = true;
    order.deliveredAt = new Date();
    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};