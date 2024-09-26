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
    city: String,
    postalCode:String,
    phone: String,
    fax: String,
    mobile:[String],
    email: String,
    website: String,
    description:String,
    nrc:String,
    nif:String,
    narticle:String,
    nis:String,
  },
  opts
);

module.exports = mongoose.model("Fournisseur", Fournisseur);
