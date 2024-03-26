const { sanitizeUser, SendMail } = require("../Middleware/Services");
const User = require("../Model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// ================================================

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async (error, hashedPassword) => {
        const response = new User({
          ...req.body,
          password: hashedPassword,
          salt,
        });
        const saveUser = await response.save();
        req.login(sanitizeUser(saveUser), (err) => {
          if (err) {
            res.status(400).json(error);
          } else {
            const token = jwt.sign(
              sanitizeUser(req.user),
              process.env.JWT_SECRET_KEY
            );
            res.cookie("Jwt_token", token);
            res.status(200).json(req.user);
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.loginUser = async (req, res) => {
  const token = jwt.sign(sanitizeUser(req.user), process.env.JWT_SECRET_KEY);
  res.cookie("Jwt_token", token);
  res.status(200).json(req.user);
};

// ================================================

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json("Unauthorize");
  }
};

// ================================================

exports.ResetPasswordRequest = async (req, res) => {
  try {
    const email = req.body.email;
    const userVerify = await User.findOne({ email: email });

    if (userVerify) {
      const Token = crypto.randomBytes(64).toString("hex");
      userVerify.resetPasswordToken = Token;
      await userVerify.save();

      // send email and token in body so that we can verify the user  has click right link

      const resetPage = `http://localhost:3000/reset_Password?token=${Token}&email=${email}`;

      const subject = "Reset Password for you E-commerce App";
      const html = `
      <img src="https://cdn1.iconfinder.com/data/icons/business-mix-3/100/business-27-256.png" width="100px height="100px"/>
      
      ---
      <br>
      <br>
      # Reset Your Password
      <br>
      <br>
      **Forgot your password?** We're here to help! 
      <br>
      <br>
      To reset your password, please follow these steps:
      <br>
      <br>
      1. Click on the "Reset Password" button below.
      <br>
      <br>
      ---
      
      <a href='${resetPage}'>Reset Password</a>
      <br>
      <br>
      ---
      
      **Contact Information:**
      <br>
      <br>
      Company: Apanee Dukaan
      <br>
      Address: Nodia 356 
      <br>
      Email: ApaneeDukaan@gmail.com
      <br>
      Phone: 8076197021
      <br>
      
      `;

      if (email) {
        const response = await SendMail({ to: email, subject, html });
        res.status(200).json(response);
      } else {
        res.status(404).json("Invalid User");
      }
    } else {
      res.status(404).json("User Not Verify");
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.ResetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    const userVerify = await User.findOne({
      email: email,
      resetPasswordToken: token,
    });

    if (userVerify) {
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        async (error, hashedPassword) => {
          (userVerify.password = hashedPassword),
            (userVerify.salt = salt),
            await userVerify.save();
        }
      );

      res.status(200).json("Password Update Successfully");
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

// ================================================

exports.signOutUser = async (req, res) => {
  res.cookie("Jwt_token", null);
  res.status(200).json("User SignOut");
};
