const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Medicament = new Schema(
  {
    commercialname: {
      type: String,
      trim: true,
    },
    dci: {
      type: String,
      trim: true,
    },
    dosage: {
      type: String,
      trim: true,
    },
    therapeutique: {
      type: String,
      trim: true,
    },
    form: {
      type: String,
      trim: true,
    },
    laboratoire:{
      type: String,
      trim: true,
    },
  },
  opts
);

module.exports = mongoose.model("Medicament", Medicament);
//# sourceMappingURL=materiel.js.map
