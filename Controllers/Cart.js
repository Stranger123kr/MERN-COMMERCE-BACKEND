const Carts = require("../Model/Cart");

// ================================================

exports.addToCarts = async (req, res) => {
  try {
    const carts = new Carts(req.body);
    const doc = await carts.save();
    const response = await doc.populate("product");
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchCartsByUser = async (req, res) => {
  const { user } = req.query;

  try {
    const response = await Carts.find({ user: user }).populate("product");
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateCarts = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Carts.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("product");
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.deleteCarts = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const response = await Carts.findByIdAndDelete(id);
    res.status(200).json("Product Deleted");
  } catch (error) {
    res.status(400).json(error);
  }
};
