require("dotenv").config();
const express = require("express");
require("./DB/Database");
const cors = require("cors");
const server = express();
const ProductsRouter = require("./Routes/Products");
const CategoryRouter = require("./Routes/Category");
const BrandsRouter = require("./Routes/Brands");
const UserRouter = require("./Routes/User");
const AuthRouter = require("./Routes/Auth");
const CartRouter = require("./Routes/Cart");

//  =================================

server.use(
  // allow to communicate with different origin domains
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.json()); // to parse req.body
server.use("/products", ProductsRouter); // it gives a full control on routes
server.use("/categories", CategoryRouter);
server.use("/brands", BrandsRouter);
server.use("/auth", AuthRouter);
server.use("/users", UserRouter);
server.use("/carts", CartRouter);

// ====================================

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
