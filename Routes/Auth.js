const router = require("express").Router();
const {
  createUser,
  loginUser,
  checkAuth,
  signOutUser,
  ResetPasswordRequest,
  ResetPassword,
} = require("../Controllers/Auth");
const passport = require("passport");
// =========================================================

router
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .post("/signup", createUser)
  .post("/logout", signOutUser)
  .post("/reset_Password_Request", ResetPasswordRequest)
  .post("/reset_Password", ResetPassword)
  .post("/login", passport.authenticate("local"), loginUser);

module.exports = router;
