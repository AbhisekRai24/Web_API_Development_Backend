const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { userId, products, total , orderType} = req.body;

    const newOrder = new Order({
      userId,
      products,
      total,
      orderType,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's orders", error });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { status } = req.body;
    const validStatuses = ["pending", "completed", "processing"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    order.status = status;
    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};