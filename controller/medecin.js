const moment = require("moment");
const underscore = require("underscore");
const Patient = require("../model/patient");

module.exports.listParMedecin = async (req, res) => {
  // get the patient id from the patients table
  const { lastname } = req.params;

  // find the patient in the database
  const patients = await Patient.find({
    "consultation.medecin": { $regex: new RegExp("^" + lastname + "$", "i") },
  });
  // send it to the client
  res.render("patient/medecin/index", {
    patients,
    medecin: lastname,
    moment,
    underscore,
  });
  //   res.send(patient)
};
