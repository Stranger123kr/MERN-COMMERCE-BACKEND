const { sanitizeUser } = require("../Middleware/Services");
const jwt = require("jsonwebtoken");
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
  .post("/login", passport.authenticate("local"), loginUser)

  .get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )

  .get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
    }),
    function (req, res) {
      const token = jwt.sign(
        sanitizeUser(req.user),
        process.env.JWT_SECRET_KEY
      );
      res.cookie(`Jwt_token=${token}; Path=/; SameSite=None; Secure`);
      res.redirect("http://localhost:3000"); // Redirect here
    }
  );

module.exports = router;
