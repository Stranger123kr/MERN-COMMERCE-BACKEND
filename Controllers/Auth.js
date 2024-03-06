const User = require("../Model/User");

// ================================================

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(203).json("Please Fill All The Fields");
  }
  try {
    const response = new User(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ================================================

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await User.findOne({ email: email });

  // this is just temporary , i'll use strong password libraries

  try {
    if (checkUser && checkUser.password === password) {
      res.status(200).json({
        id: checkUser.id,
        email: checkUser.email,
        user: checkUser.name,
        role: checkUser.role,
        addresses: checkUser.addresses,
      });
    } else {
      res.status(401).json({ message: "Credentials are Wrong" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
