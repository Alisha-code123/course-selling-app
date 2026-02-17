import { Order } from "../models/order.model.js";
import Purchase from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  try {
    // 🔐 userId from JWT middleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId, paymentId, amount, status } = req.body;

    if (!courseId || !paymentId || !amount || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🚫 Prevent duplicate purchase
    const existingPurchase = await Purchase.findOne({
      userId,
      courseId,
    });

    if (existingPurchase) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    // 🧾 Create order
    const orderInfo = await Order.create({
      userId,
      courseId,
      paymentId,
      amount,
      status,
    });

    // 📦 Create purchase record
    await Purchase.create({
      userId,
      courseId,
    });

    res.status(201).json({
      success: true,
      orderInfo,
    });

  } catch (error) {
    console.error("Error in order creation:", error);
    res.status(500).json({ message: "Error in order creation" });
  }
};

