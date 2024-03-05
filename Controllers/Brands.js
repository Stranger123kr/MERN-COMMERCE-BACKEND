const Brands = require("../Model/Brands");

// ================================================

exports.createBrands = async (req, res) => {
  try {
    const response = new Brands(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchBrands = async (req, res) => {
  try {
    const response = await Brands.find({});
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
