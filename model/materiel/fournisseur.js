const mongoose = require("mongoose");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Fournisseur = new Schema(
  {
    name: String,
    wilaya: String,
    phone1: String,
    phone2: String,
    email: String,
  },
  opts
);

module.exports = mongoose.model("Fournisseur", Fournisseur);
