const router = require("express").Router();
const {
  createProduct,
  fetchAllProduct,
  fetchProductById,
  updateProduct,
  deleteProduct,
} = require("../Controllers/Products");

// =========================================================

router
  .get("/", fetchAllProduct)
  .get("/:id", fetchProductById)
  .post("/", createProduct)
  .patch("/:id", updateProduct)
  .delete("/:id", deleteProduct);

module.exports = router;
