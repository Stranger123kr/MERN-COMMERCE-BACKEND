const router = require("express").Router();
const { createUser, loginUser } = require("../Controllers/Auth");

// =========================================================

router.post("/signup", createUser).post("/login", loginUser);

module.exports = router;
