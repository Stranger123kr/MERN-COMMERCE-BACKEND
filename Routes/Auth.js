const router = require("express").Router();
const {
  createUser,
  loginUser,
  checkAuth,
  signOutUser,
} = require("../Controllers/Auth");
const passport = require("passport");
// =========================================================

router
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/logout", signOutUser)
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser);

module.exports = router;
