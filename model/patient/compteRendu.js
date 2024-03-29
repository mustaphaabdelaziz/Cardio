const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  //for adulte and congenitale
  adulte: {
    type: Boolean,
  },
  //name of the model
  type: {
    type: String,
    // unique: true,
  },
  atcd: String,
  quality: String,
  indication: {
    _id: false,
    situs: String,
    aorte: String,
    valveAortique: String,
    oreilletteGauche: String,
    sia: String,
    valveMitrale: String,
    ventriculeGauche: {
      motif: String,
      dtd: String,
      siv: String,
      fe: String,
    },
    siv: String,
    cavitesDroites: String,
    tricuspide: String,
    arterePulmonaire: String,
    pericarde: String,
  },
  conclusion: String,
  conduiteMedicale: String,
  createdBy: {
    _id: false,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
});

module.exports = mongoose.model("Report", ReportSchema);
