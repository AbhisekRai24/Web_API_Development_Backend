require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const adminCategoryRoutes = require("./routes/admin/categoryRouteAdmin")
const adminProductRoutes = require("./routes/admin/productRouteAdmin")
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const orderRoutes = require("./routes/orderRoutes")


const cors = require("cors")
const path = require("path")
const app = express();

app.use(express.json());
let corsOptions = {
  origin: "*"
}
app.use(cors(corsOptions))

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to DB
connectDB();


app.use("/api/auth", userRoutes);
app.use("/api/admin/category", adminCategoryRoutes)
app.use("/api/admin/product", adminProductRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


