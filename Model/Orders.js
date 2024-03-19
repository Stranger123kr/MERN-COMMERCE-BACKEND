const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrdersSchema = new Schema({
  GetAddToCart: {
    type: [Schema.Types.Mixed],
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  totalItemsCount: {
    type: Number,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  selectedAddress: {
    type: Schema.Types.Mixed,
    required: true,
  },

  // ToDo i will add enum in payment and status and user role for admin

  paymentMethod: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "pending",
  },
});

// ===================================================

const virtualId = OrdersSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

OrdersSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===================================================

module.exports = mongoose.model("Orders", OrdersSchema);
