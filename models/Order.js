const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      _id: { type: String, required: true }, // product ID
      name: String,
      price: Number,
      quantity: Number,
      productImage: String,
    },
  ],
  total: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "processing"], // add statuses you want
    default: "pending",
  },
   orderType: {
    type: String,
    enum: ["dine-in", "takeaway"],
    default: "takeaway", // optional default
  },
});

module.exports = mongoose.model("Order", orderSchema);
