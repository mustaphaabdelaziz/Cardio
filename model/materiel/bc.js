const mongoose = require("mongoose");
const moment = require("moment");

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
    articles: [{
      designation:String,
      qte: Number,
      
    }],
  },
  opts
);

module.exports = mongoose.model("Bc", Bc);
//# sourceMappingURL=materiel.js.map
