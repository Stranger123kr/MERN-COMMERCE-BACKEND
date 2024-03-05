const router = require("express").Router();
const { fetchBrands, createBrands } = require("../Controllers/Brands");

// =========================================================

router.get("/", fetchBrands);
router.post("/", createBrands);

module.exports = router;
