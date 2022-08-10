const mongoose = require("mongoose");

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
        etat: String,
        lot: String,
        marque: String,
        fournisseur: String,
        dateachat: Date,
        bc: Number,
        bl: Number,
        fc: Number,
        quantite: Number,
        detail: [
          {
            serie: String,
            ddp: Date,
          },
        ],
      },
    ],
  },
  opts
);

Materiel.virtual("qteglobal").get(function () {
  return this.article.reduce((quantity, art) => {
    if (art.etat === "Reçu") {
      return quantity + art.quantite;
    } else if (art.etat === "Retour") {
      return quantity - art.quantite;
    } else return quantity;
  }, 0);
});

module.exports = mongoose.model("Materiel", Materiel);

