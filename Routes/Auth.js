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

  // ====================================================

  // github authentication routes

  .get("/github", passport.authenticate("github", { scope: ["user:email"] }))

  .get(
    "/github/callback",
    passport.authenticate("github", {
      failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    function (req, res) {
      const token = jwt.sign(
        sanitizeUser(req.user),
        process.env.JWT_SECRET_KEY
      );
      res.cookie(`Jwt_token=${token}; Path=/; SameSite=None; Secure`);
      res.redirect(process.env.FRONTEND_URL); // Redirect here
    }
  )

  // ====================================================

  // google authentication routes

  .get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )

  .get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    function (req, res) {
      const token = jwt.sign(
        sanitizeUser(req.user),
        process.env.JWT_SECRET_KEY
      );
      res.cookie(`Jwt_token=${token}; Path=/; SameSite=None; Secure`);
      res.redirect(process.env.FRONTEND_URL); // Redirect here
    }
  );

module.exports = router;
