const router = require("express").Router();
const { fetchCategory, createCategory } = require("../Controllers/Category");

// =========================================================

router.get("/", fetchCategory).post("/", createCategory);

module.exports = router;
