const Product = require("../Model/Product");

// ================================================

exports.createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  } = req.body;

  const product = new Product({
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  });
  try {
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const productSave = await product.save();
    res.status(201).json(productSave);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create product", details: error.message });
  }
};

// ================================================

exports.fetchAllProduct = async (req, res) => {
  const { _search, category, brand, _sort, _order, _page, _limit } = req.query;

  let query = Product.find({});

  // searching functionality

  if (_search) {
    const searchValues = _search
      .split(" ")
      .map((value) => value.trim().toLowerCase());
    const searchFilters = searchValues.map((value) => ({
      $or: [
        { title: { $regex: value, $options: "i" } },
        { category: { $regex: value, $options: "i" } },
        { brand: { $regex: value, $options: "i" } },
      ],
    }));
    query = query.find({ $and: searchFilters });
  }

  // category functionality

  if (category) {
    query = query.find({ category: category.split(",") });
  }

  // brand functionality

  if (brand) {
    query = query.find({ brand: brand.split(",") });
  }

  // sorting functionality

  if (_sort && _order) {
    query = query.sort({ [_sort]: _order });
  }

  // this is use for calculate all Product in database
  const totalDocs = await Product.countDocuments(query);

  // pagination functionality

  if (_page && _limit) {
    const Page = Number(_page);
    const PageSize = Number(_limit);
    const Skip = (Page - 1) * PageSize;
    query = query.skip(Skip).limit(PageSize);
  }

  // ==========================================

  try {
    const allProduct = await query;
    res.set("X-Total-Count", totalDocs), res.status(200).json(allProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const productById = await Product.findById(id);
    res.status(200).json(productById);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json("Product Deleted Successfully");
  } catch (error) {
    res.status(400).json(error);
  }
};
