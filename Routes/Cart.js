const router = require("express").Router();
const {
  addToCarts,
  fetchCartsByUser,
  updateCarts,
  deleteCarts,
} = require("../Controllers/Cart");

// =========================================================

router
  .get("/", fetchCartsByUser)
  .post("/", addToCarts)
  .patch("/:id", updateCarts)
  .delete("/:id", deleteCarts);

module.exports = router;
