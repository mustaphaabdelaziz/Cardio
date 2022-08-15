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
    designation: { type: String },
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

        detail: [
          {
            serie: String,
            ddp: Date,
            quantite: { type: Number, default: 1 },
            taken: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  opts
);
Materiel.virtual("quantity").get(function () {
  return 0;
  // return this.article.reduce((article, current) => {}, 0);
});
Materiel.virtual("consumedQuantity").get(function () {
  return this.article.reduce((quantity, article) => {
    if (article.etat === "Reçu")
      return (
        quantity +
        article.detail.reduce((quantity, detail) => {
          if (detail.taken) return quantity + detail.quantite;
          else return quantity;
        }, 0)
      );
    else if (article.etat === "Retour") return quantity - art.detail.length;
    else return quantity;
  }, 0);
});

Materiel.virtual("qteglobal").get(function () {
  return this.article.reduce((quantity, art) => {
    if (art.etat === "Reçu") {
      return quantity + art.detail.length;
    } else if (art.etat === "Retour") {
      return quantity - art.detail.length;
    } else return quantity;
  }, 0);
});

module.exports = mongoose.model("Materiel", Materiel);
