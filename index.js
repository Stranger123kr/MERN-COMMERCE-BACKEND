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
const crypto = require("crypto");
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
server.use(cookieParser());

server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: {
      sameSite: "None",
      secure: true,
    },
  })
);

server.use(passport.authenticate("session"));
server.use(
  // allow to communicate with different origin domains
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

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
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

server.post("/create/payment", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Amount should be in paise
      currency: "INR",
      receipt: "order_rcptid_11",
    };

    const response = await instance.orders.create(options);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ======================================

server.post("/payment/success", async (req, res) => {
  try {
    // Getting the details back from our front-end
    const {
      orderCreationId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Creating the expected signature
    const generated_signature = razorpay_order_id + "|" + razorpay_payment_id;

    // Checking if the generated signature matches the received signature

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(generated_signature.toString())
      .digest("hex");

    // Comparing the expected signature with the received signature
    if (expectedSignature === razorpay_signature) {
      res.redirect(
        `${process.env.FRONTEND_URL}/order_success/${razorpay_order_id}`
      );
    } else {
      res.status(400).json({ msg: "Transaction not legit!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ===================================================================

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
