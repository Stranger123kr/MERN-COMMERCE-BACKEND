const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

// ===================================================

const virtualId = BrandSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

BrandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===================================================

module.exports = mongoose.model("Brand", BrandSchema);
