const router = require("express").Router();
const { fetchBrand, createBrand } = require("../Controllers/Brand");

// =========================================================

router.get("/", fetchBrand).post("/", createBrand);
// .patch("/", createBrand);

module.exports = router;
