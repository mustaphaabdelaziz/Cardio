const mongoose = require("mongoose");
const moment = require("moment");
const underscore = require("underscore");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Staff = new Schema(
  {
    firstname: String,
    lastname: String,
    externe: {
      type: String,
      default: "interne",
    },
    fonction: String,
    phone: String,
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
