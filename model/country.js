const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema({
  country: String,
  code: String,
  flag: String,
  states: [
    {
      id: Number,
      name: String,
      communes: [String],
    },
  ],
});

module.exports = mongoose.model("Country", countrySchema);
