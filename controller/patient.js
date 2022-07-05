let pdf = require("html-pdf");
const moment = require("moment");
const patient = require("../model/patient");
const Patient = require("../model/patient");

module.exports.listepatient = async (req, res) => {
  const patients = await Patient.find({});
  res.render("patient/index", { patients, moment });
  // res.render("patient/accuse", { patients, moment });
};
module.exports.creationform = (req, res) => {
  res.render("patient/new");
};
module.exports.showpatient = async (req, res) => {
  // get the patient id from the patients table
  const { id } = req.params;
  // find the patient in the database
  const patient = await Patient.findById(id);
  // send it to the client
  res.render("patient/show", { patient, moment });
  // res.send(patient)
};

module.exports.createpatient = async (req, res) => {
  var { firstname, lastname, birthdate, gender, phone } = req.body.patient;

  const patient = new Patient({
    firstname,
    lastname,
    birthdate,
    phone,
    gender,
  });
  await patient.save();
  req.flash("success", "Patient ajouté avec succès");
  res.redirect("/patient");
};
module.exports.showEditForm = async (req, res) => {
  res.render("patient/edit");
};
module.exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { patient } = req.body;

  await Patient.findByIdAndUpdate(id, { ...patient }, { new: true });
  req.flash("success", "Patient a été modifié avec succès");
  res.redirect("back");
};
module.exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Patient.findByIdAndDelete(id);
  req.flash("success", "Patient a été supprimé");
  res.redirect("/patient");
};
module.exports.generatepdf = async (req, res) => {
  // let patients = [
  //   {
  //     firstname: "John",
  //     lastname: "Doe",
  //     birthdate: "01/01/2000",
  //     phone: "0612345678",
  //   },
  //   {
  //     firstname: "John",
  //     lastname: "Doe",
  //     birthdate: "01/01/2000",
  //     phone: "0612345678",
  //   },
  //   {
  //     firstname: "John",
  //     lastname: "Doe",
  //     birthdate: "01/01/2000",
  //     phone: "0612345678",
  //   },
  // ];
  const patients = await Patient.find({});

  console.log("generatepdf");
  const ps = JSON.stringify(patients);
  let liste = [];
  patients.forEach(patient => {
    liste.push({
      firstname: patient.firstname,
      lastname: patient.lastname,
      birthdate: patient.birthdate,
      phone: patient.phone,
    });
  }); 
  console.log(liste);
  res.render("report-template", { patients:liste,moment }, (err, data) => {
    console.log("data", data);
    if (err) {
      console.log("err");
      res.send(err);
    } else {
      let options = {
        height: "11.25in",
        width: "8.5in",
        header: {
          height: "20mm",
        },
        footer: {
          height: "20mm",
        },
      };
      pdf.create(data, options).toFile("report.pdf", function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.redirect("/patient");
        }
      });
    }
  });
};
