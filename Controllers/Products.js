const Products = require("../Model/Products");

// ================================================

exports.createProducts = async (req, res) => {
  try {
    const product = new Products(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchAllProducts = async (req, res) => {
  // TODO : we have to try with multiple category and brands after changes in frontend

  const { search, category, brand, _sort, _order, _page, _limit } = req.query;

  let query = Products.find({});

  // searching functionality

  if (search) {
    const searchValues = search
      .split(",")
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

  // this is use for calculate all products
  const totalDocs = await Products.countDocuments(query);

  // pagination functionality

  if (_page && _limit) {
    const Page = Number(_page);
    const PageSize = Number(_limit);
    const Skip = (Page - 1) * PageSize;
    query = query.skip(Skip).limit(PageSize);
  }

  // ==========================================

  try {
    const response = await query;
    res.set("X-Total-Count", totalDocs), res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.fetchProductsById = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await Products.findById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Products.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Products.findByIdAndDelete(id);
    res.status(200).json("Product Deleted");
  } catch (error) {
    res.status(400).json(error);
  }
};
