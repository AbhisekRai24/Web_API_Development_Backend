const express = require("express")
const router = express.Router()
const productController = require("../../controllers/admin/productmanagement")
const upload = require("../../middlewares/fileupload")

router.post(
    "/",
    upload.single("productImage"), 
    productController.createProduct
)
router.get(
    "/",
    productController.getProducts
)
router.delete('/:id', productController.deleteProduct);
router.get("/category/:categoryId", productController.getProductsByCategory)


module.exports = router
