const fs = require("fs");
const path = require("path");
const Product = require("../../models/Product")

exports.createProduct = async (req, res) => {
    const { name, price,description, categoryId, userId } = req.body
    // const productImage = req.file ? req.file.filename : null; 
    const productImage = req.file ? req.file.path : null;  

    // validataion
    if (!name || !price || !categoryId || !userId) {
        return res.status(403).json(
            { success: false, message: "Missing field" }
        )
    }
    try {
        const product = new Product(
            {
                name,
                price,
                description,
                categoryId,
                sellerId: userId,
                productImage
            }
        )
        await product.save()
        return res.status(200).json(
            {
                success: true,
                data: product,
                message: 'New Product Created'
            }
        )
    } catch (err) {
        return res.status(500).json(
            {
                success: false,
                message: 'Server error'
            }
        )
    }
}

exports.getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } =
            req.query

        let filter = {}
        if (search) {
            filter.$or = [
                {
                    name:
                    {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        }
        const skips = (page - 1) * limit

        const products = await Product.find(filter)
            .populate("categoryId", "name")
            .populate("sellerId", "firstName email")
            .skip(skips)
            .limit(Number(limit))
        const total = await Product.countDocuments(filter)
        return res.status(200).json(
            {
                success: true,
                message: "Requested Product Fetched",
                data: products,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(
                        total / limit
                    )
                }
            }
        )
    } catch (err) {
        console.log('getProducts', {
            message: err.message,
            stack: err.stack,
        });
        return res.status(500).json(
            { success: false, message: "Server error" }
        )
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Delete the image file from disk (if it exists)
        if (product.productImage) {
            const imagePath = path.join(__dirname, "..", "..", "uploads", product.productImage);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.warn("Image file deletion failed or not found:", err.message);
                    // Not returning error here so deletion can proceed even if image missing
                }
            });
        }

        await product.deleteOne();

        return res.json({
            success: true,
            message: "Product has been deleted"
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId

    const products = await Product.find({ categoryId })
      .populate("categoryId", "name")
      .populate("sellerId", "firstName email") // optional, for UI

    return res.status(200).json({
      success: true,
      message: "Products fetched by category",
      data: products
    })
  } catch (err) {
    console.error("getProductsByCategory Error:", err)
    return res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}
