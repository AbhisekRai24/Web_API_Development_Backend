// require("dotenv").config();

// const express = require("express");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoute");
// const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin")
// const adminProductRoutes = require("./routes/admin/productRouteAdmin")
// const adminUserRoutes = require("./routes/admin/userRouteAdmin")
// const orderRoutes = require("./routes/orderRoutes")


// const cors = require("cors")
// const path = require("path")
// const app = express();

// let corsOptions = {
//   origin: "*"
// }
// app.use(cors(corsOptions))

// app.use(express.json())
// app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// // Connect to DB
// connectDB();


// app.use("/api/auth", userRoutes);
// app.use("/api/admin/category", adminCategoryRoutes)
// app.use("/api/admin/product", adminProductRoutes)
// app.use("/api/admin/users", adminUserRoutes)
// app.use("/api/orders", orderRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin");
const adminProductRoutes = require("./routes/admin/productRouteAdmin");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");


const app = express();
const server = http.createServer(app); // 👈 Create server manually
const io = new Server(server, {
  cors: {
    origin: "*", // Or use your frontend URL
    methods: ["GET", "POST"],
  },
});

// 🌐 Expose Socket.IO globally so controllers can use it
global.io = io;

// 💬 Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId); // Join room by userId
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 🌍 Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📦 Connect to MongoDB
connectDB();

// 🛣️ Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;

