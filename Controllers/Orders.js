const Orders = require("../Model/Orders");

// ================================================

exports.addToOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const order = new Orders({ ...req.body, user: id });
    const doc = await order.save();
    const response = await doc.populate("user");
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
  const { _sort, _order, _page, _limit } = req.query;

  let OrderQuery = Orders.find({});

  if (_sort && _order) {
    OrderQuery = OrderQuery.sort({ [_sort]: _order });
  }

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
