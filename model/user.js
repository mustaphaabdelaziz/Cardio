const mongoose = require("mongoose");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
//  This strategy integrates Mongoose with the passport-local strategy.
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstname: String,
    lastname: String,
    badgenumber: Number,
  },
  opts
);

User.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

User.plugin(passportLocalMongoose, {
  usernameField: "username",
});
module.exports = mongoose.model("User", User);
