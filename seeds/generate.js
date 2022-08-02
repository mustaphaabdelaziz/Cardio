if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");

const Country = require("../model/country");
const algeria = require("./algeriaState");
const DBConnection = require("../database/connection");

const seedDB = async () => {
  await Country.deleteMany({});
  const country = new Country({
    country: algeria.country,
    code: algeria.code,
    flag: algeria.flag,
  });
  country.states = algeria.states;
  await country.save();
};
seedDB().then(() => {
  mongoose.connection.close();
});
