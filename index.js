require("dotenv").config();
const express = require("express");
require("./DB/Database");
const cors = require("cors");
const server = express();
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { PassportAuthentication } = require("./Middleware/PassportAuth");
const { Auth } = require("./Middleware/Services");
const { Passport_jwtAuthentication } = require("./Middleware/passport_jwt");
const Razorpay = require("razorpay");
//  =================================

const ProductRouter = require("./Routes/Product");
const CategoryRouter = require("./Routes/Category");
const BrandRouter = require("./Routes/Brand");
const UserRouter = require("./Routes/User");
const AuthRouter = require("./Routes/Auth");
const CartRouter = require("./Routes/Cart");
const OrderRouter = require("./Routes/Orders");

// =================================

// middlewares

server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      secure: false, // Set to true if using HTTPS
      sameSite: false, // Set to true if using the "Lax" SameSite attribute
    },
  })
);
server.use(cookieParser());
server.use(passport.authenticate("session"));
server.use(
  // allow to communicate with different origin domains
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json());
// server.use(express.urlencoded({ extended: true }));

// ==============================================
PassportAuthentication(passport); // user authentication function call
Passport_jwtAuthentication(passport); // jwt authentication function call
// these are routes
server.use("/products", Auth(), ProductRouter); // we can also use Jwt Token for client-only auth
server.use("/categories", Auth(), CategoryRouter);
server.use("/brands", Auth(), BrandRouter);
server.use("/auth", AuthRouter);
server.use("/users", Auth(), UserRouter);
server.use("/carts", Auth(), CartRouter);
server.use("/orders", Auth(), OrderRouter);

// ====================================

const instance = new Razorpay({
  key_id: "rzp_test_BqpAdjmem7uL88",
  key_secret: "dg06IwTgpUjS5HkMQzZMEJKs",
});

server.post("/create/orderId", (req, res) => {
  console.log(req.body);

  const options = {
    amount: Number(req.body.amount * 100), // amount in the smallest currency unit
    currency: "INR",
    // receipt: "order_rcptid_11",
  };
  instance.orders.create(options, (err, order) => {
    console.log(order);
    res.status(200).json(order);
  });
});

// ====================================

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
