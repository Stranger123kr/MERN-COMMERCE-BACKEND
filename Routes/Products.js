const router = require("express").Router();
const {
  createProducts,
  fetchAllProducts,
  fetchProductsById,
  updateProducts,
  deleteProducts,
} = require("../Controllers/Products");

// =========================================================

router
  .get("/", fetchAllProducts)
  .get("/:id", fetchProductsById)
  .post("/", createProducts)
  .patch("/:id", updateProducts)
  .delete("/:id", deleteProducts);

module.exports = router;
