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

  // let ps = [];
  // let i = 1;
  // for (const patient of patients) {
  //   for (let j= 0; j < patient.consultation.length; j++) {
  //     console.log(patient.consultation[j].acte);
  //     ps.push([
  //       i,
  //       patient.lastname,
  //       patient.firstname,
  //       patient.father,
  //       patient.age,
  //       patient.phone,
  //       patient.phone2,
  //       patient.consultation[j].acte,
  //       moment(patient.consultation[j].date).format("DD/MM/YYYY"),
  //       patient.consultation[j].status,
  //     ]);
  //     i++;
  //   }
  // }
  res.render("patient/medecin/index", {
    patients,
    medecin: lastname,
    moment,
    underscore,
  });

  // res.send(ps);
};
