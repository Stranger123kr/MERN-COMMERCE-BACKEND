const router = require("express").Router();
const { fetchUserById, updateUser } = require("../Controllers/User");

// =========================================================

router.get("/own", fetchUserById);
router.patch("/:id", updateUser);

module.exports = router;
