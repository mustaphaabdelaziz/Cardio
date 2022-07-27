const mongoose = require("mongoose");
const moment = require("moment");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Materiel = new Schema(
  {
    code: String,
    designation: String,

    article: [
      {
        dateachat: Date,
        quantite: Number,
        ref: String,
        designation: String,
      },
    ],
  },
  opts
);

Materiel.virtual("qteglobal").get(function () {
  return this.article.reduce((quantity, art) => quantity + art.quantite,0);
});

module.exports = mongoose.model("Materiel", Materiel);
//# sourceMappingURL=materiel.js.map
