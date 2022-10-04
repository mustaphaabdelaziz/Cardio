if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");

const Country = require("../model/country");
const algeria = require("./algeriaState");
const wilaya = require("./wilaya_Of_Algeria");
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
  for (let i = 0; i < algeria.states.length; i++) {
  
    await Country.findOneAndUpdate(
      { "states.id": algeria.states[i].id },
      {
        $set: {
          "states.$.ar_name": wilaya.states[i].ar_name,
          "states.$.longitude": wilaya.states[i].longitude,
          "states.$.latitude": wilaya.states[i].latitude,
        },
      }
    );
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
