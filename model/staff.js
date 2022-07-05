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
    birthdate: Date,
    gender: String,
    role: String,
    phone:String,
  },
  opts
);
Staff.virtual("fullname").get(function () {
  return this.lastname + " " + this.firstname;
});

module.exports = mongoose.model("Staff", Staff);
