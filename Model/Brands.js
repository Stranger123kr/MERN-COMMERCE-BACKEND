const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandsSchema = new Schema({
  value: {
    type: String,
    required: true,
    unique: true,
  },

  label: {
    type: String,
    required: true,
    unique: true,
  },
});

// ===================================================

const virtualId = BrandsSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

BrandsSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===================================================

module.exports = mongoose.model("Brands", BrandsSchema);
