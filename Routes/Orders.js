const router = require("express").Router();
const {
  addToOrder,
  fetchOderByUser,
  fetchAllOder,
  updateOrder,
} = require("../Controllers/Orders");

// =========================================================

router
  .get("/", fetchOderByUser)
  .get("/admin", fetchAllOder)
  .post("/", addToOrder)
  .patch("/:id", updateOrder);

//   .delete("/:id", deleteCarts);

module.exports = router;
