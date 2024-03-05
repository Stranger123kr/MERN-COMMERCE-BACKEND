const Category = require("../Model/Category");

// ================================================

exports.createCategory = async (req, res) => {
  try {
    const response = new Category(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchCategory = async (req, res) => {
  try {
    const response = await Category.find({});
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateCategory = async (req, res) => {
  try {
    const response = new Category(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
