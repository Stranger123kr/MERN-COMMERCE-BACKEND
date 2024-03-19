const Category = require("../Model/Category");

// ================================================

exports.createCategory = async (req, res) => {
  const { value, label } = req.body;
  try {
    const category = new Category({ value, label });
    const saveCategory = await category.save();
    res.status(201).json(saveCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchCategory = async (req, res) => {
  try {
    const getCategory = await Category.find({});
    res.status(200).json(getCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateCategory = async (req, res) => {
  const { value, label } = req.body;
  try {
    const response = new Category(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
