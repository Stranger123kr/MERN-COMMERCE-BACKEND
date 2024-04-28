const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: Buffer,
      required: true,
    },

    role: {
      type: String,
      required: true,
      default: "user",
    },

    addresses: {
      type: [Schema.Types.Mixed],
    },

    name: {
      type: String,
    },

    socialMediaId: {
      type: String,
    },

    image: {
      type: String,
    },

    orders: {
      type: [Schema.Types.Mixed],
    },

    salt: {
      type: Buffer,
      required: true,
    },

    resetPasswordToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ===================================================

const virtualId = UserSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// ===================================================

module.exports = mongoose.model("User", UserSchema);
