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
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    privileges: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  opts
);

User.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

User.plugin(passportLocalMongoose, {
  usernameField: "email",
});
module.exports = mongoose.model("User", User);
