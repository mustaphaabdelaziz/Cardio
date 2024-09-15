const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const moment = require("moment");
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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
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
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
      default: "undefined",
    },
    loggedIn: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetToken: {
      token: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      expires: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  opts
);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
User.plugin(passportLocalMongoose);
User.virtual("fullname").get(function () {
  return this.lastname + " " + this.firstname;
});
User.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.salt = salt;
  this.hash = await bcrypt.hash(this.hash, salt);

  next();
});

// comparer function
User.methods.verifyPassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};
module.exports = mongoose.model("User", User);
