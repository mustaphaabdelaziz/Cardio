const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Bc = new Schema(
  {
    date: Date,
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    articles: [
      {
        designation: String,
        marque: String,
        serie: String,
        quantite: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  opts
);

module.exports = mongoose.model("Bc", Bc);
//# sourceMappingURL=materiel.js.map
