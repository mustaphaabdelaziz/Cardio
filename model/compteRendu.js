const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  type: String,
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
});

module.exports = mongoose.model("Report", ReportSchema);
