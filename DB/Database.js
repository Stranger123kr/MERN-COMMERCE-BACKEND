const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

connection();
