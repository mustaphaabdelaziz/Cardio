if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Report = require("../model/patient/compteRendu");
const reports = require("./comptRendu");
const Country = require("../model/data/country");
const algeria = require("./algeriaState");
const wilaya = require("./wilaya_Of_Algeria");
const Acte = require("../model/acte/acte");
const acteList = require("./liste_actes");
const DBConnection = require("../database/connection");

const seedDB = async () => {
  // await Country.deleteMany({});
  // const country = new Country({
  //   country: algeria.country,
  //   code: algeria.code,
  //   flag: algeria.flag,
  // });
  // country.states = algeria.states;
  // await country.save();

  // for (let i = 0; i < algeria.states.length; i++) {
  //   await Country.findOneAndUpdate(
  //     { "states.id": algeria.states[i].id },
  //     {
  //       $set: {
  //         "states.$.ar_name": wilaya.states[i].ar_name,
  //         "states.$.longitude": wilaya.states[i].longitude,
  //         "states.$.latitude": wilaya.states[i].latitude,
  //       },
  //     }
  //   );
  // }
  // for (const report of reports.compterendu) {
  //   const compteRendu = new Report({
  //     type: report.type,
  //     atcd: report.atcd,
  //     quality: report.quality,
  //     indication: report.indication,
  //     conclusion: report.conclusion,
  //     conduiteMedical: report.conduiteMedical,
  //   });
  //   console.log(compteRendu);
  //   await compteRendu.save();
  // }
  for (const act of acteList.actes) {
    const acte = new Acte({
      service: act.service,
      speciality: act.speciality,
      designation: act.designation,
      nbr_days: act.nbr_days,
      price: act.price,
      tva: act.tva,
    });
    console.log(acte);
    await acte.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
