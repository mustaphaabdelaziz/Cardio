const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

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
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true, required: true },
    externe: {
      type: String,
      default: "interne",
    },
    fonction: String,
    phone: { type: String, trim: true },
    privileges: [
      {
        type: String,
        default: "user",
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
    compterendu: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report",
      },
    ],
    loggedIn: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);

User.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});

User.plugin(passportLocalMongoose, {
  usernameField: "email",
  passwordField: "password",
});
// comparer function
// User.methods.verifyPassword = async (password) => {
//   const isMatch = await bcrypt.compare(password, this.password);
//   return isMatch;
// };
module.exports = mongoose.model("User", User);
