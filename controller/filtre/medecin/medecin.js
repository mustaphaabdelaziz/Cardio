const moment = require("moment");
const underscore = require("underscore");
const Patient = require("../../../model/patient/patient");

module.exports.listParMedecin = async (req, res) => {
  // get the patient id from the patients table
  const { lastname } = req.params;

  // find the patient in the database
  const patients = await Patient.find({
    "consultation.medecin": { $regex: new RegExp("^" + lastname + "$", "i") },
    activated: true
  }).sort({
    lastname: 1,
  })
  

  // let ps = [];
  // let i = 1;
  // for (const patient of patients) {
  //   for (let j= 0; j < patient.consultation.length; j++) {
  //    
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
  res.render("patient/filtre/medecin/index", {
    patients,
    medecin: lastname,
    moment,
    underscore,
  });

  // res.send(ps);
};
