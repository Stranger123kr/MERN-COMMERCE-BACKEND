const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  quantity: {
    type: Number,
    required: true,
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// ===================================================

const virtualId = CartSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

CartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===================================================

module.exports = mongoose.model("Carts", CartSchema);
