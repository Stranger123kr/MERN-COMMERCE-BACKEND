const { InvoiceTemplate, SendMail } = require("../Middleware/Services");
const Orders = require("../Model/Orders");
const User = require("../Model/User");
const Product = require("../Model/Product");
// ================================================

exports.addToOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const order = new Orders({ ...req.body, user: id });

    // stock manipulation before save the order 1 Method

    // order.GetAddToCart.forEach(async (item) => {
    //   const id = item.product.id;
    //   const ProductFind = await Product.findById(id);
    //   ProductFind.stock -= item.quantity;
    //   await ProductFind.save();
    // });

    // stock manipulation before save the order 2 Method

    order.GetAddToCart.forEach(async (item) => {
      const ProductFind = await Product.findById(item.product.id);
      ProductFind.$inc("stock", -1 * item.quantity);
      await ProductFind.save();
    });

    // =========================================

    const doc = await order.save();
    const response = await doc.populate("user");

    // ========================================

    const user = await User.findById(order.user);

    // this is method to send invoice to user for their order

    await SendMail({
      to: user.email,
      subject: "This is Invoice Email of Your Order",
      html: InvoiceTemplate(order),
    });

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchOderByUser = async (req, res) => {
  const { id } = req.user;

  try {
    const response = await Orders.find({ user: id });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchAllOder = async (req, res) => {
  const { _page, _limit } = req.query;

  let OrderQuery = Orders.find({});

  // this is use for calculate all Product
  const totalDocs = await Orders.countDocuments(OrderQuery);

  if (_page && _limit) {
    const Page = Number(_page);
    const PageSize = Number(_limit);
    const Skip = (Page - 1) * PageSize;
    OrderQuery = OrderQuery.skip(Skip).limit(PageSize);
  }

  try {
    const response = await OrderQuery;
    res.set("X-Total-Count", totalDocs), res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchOderById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Orders.findById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Orders.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

// exports.deleteCarts = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   try {
//     const response = await Carts.findByIdAndDelete(id);
//     res.status(200).json("Product Deleted");
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };
