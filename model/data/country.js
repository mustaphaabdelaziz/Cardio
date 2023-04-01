const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  country: String,
  code: String,
  flag: String,
  states: [
    {
      _id: false,
      id: Number,
      name: String,
      ar_name: String,
      longitude: String,
      latitude: String,
      communes: [String],
    },
  ],
});

module.exports = mongoose.model("Country", countrySchema);
