const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actSchema = new Schema({
  service: {
    type: String,
    trim: true,
    upperCase: true,
  },
  speciality: {
    type: String,
    trim: true,
    upperCase: true,
  },
  type: {
    type: String,
    trim: true,
    upperCase: true,
  },
  designation: {
    type: String,
    trim: true,
    upperCase: true,
  },
  nbr_days: String,
  price: String,
  tva: String,
});

module.exports = mongoose.model("Act", actSchema);
