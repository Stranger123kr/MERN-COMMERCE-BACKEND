const User = require("../Model/User");

// ================================================

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await User.findById(id).select({
      password: 0,
      salt: 0,
      googleId: 0,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};
