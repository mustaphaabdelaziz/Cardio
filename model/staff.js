const mongoose = require("mongoose");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Staff = new Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true, required: true },
    externe: {
      type: String,
      default: "interne",
    },
    fonction: String,
    phone: { type: String, trim: true },
    email: String,
  },
  opts
);
Staff.virtual("fullname").get(function () {
  return this.lastname + " " + this.firstname;
});

Staff.virtual("typestuff").get(function () {
  if (this.externe === "externe") {
    return this.fonction + " externe";
  } else {
    return this.fonction + " interne";
  }
});

module.exports = mongoose.model("Staff", Staff);
