const { sanitizeUser } = require("../Middleware/Services");
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
  // res.setHeader("Authorization", `${token}`);
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

exports.signOutUser = async (req, res) => {
  res.cookie("Jwt_token", null);
  res.status(200).json("done");
};
