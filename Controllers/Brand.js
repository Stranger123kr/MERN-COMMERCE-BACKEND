const Brand = require("../Model/Brand");

// ================================================

exports.createBrand = async (req, res) => {
  const { value, label } = req.body;
  try {
    const brand = new Brand({ value, label });
    const saveBrand = await brand.save();
    res.status(201).json(saveBrand);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchBrand = async (req, res) => {
  try {
    const getBrand = await Brand.find({});
    res.status(200).json(getBrand);
  } catch (error) {
    res.status(400).json(error);
  }
};
