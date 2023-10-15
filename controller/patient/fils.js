const fs = require("fs");
const Pdfmake = require("pdfmake");
// Define font files
const moment = require("moment");
const Staff = require("../../model/staff/staff");
const Country = require("../../model/data/country");
const Patient = require("../../model/patient/patient");
const Report = require("../../model/patient/compteRendu");
const conduiteMedicale = require("../../seeds/conduiteMedicale");
const actes = ["Consultation", "Chirurgie", "KT"];
var fonts = {
  Roboto: {
    normal: "fonts/roboto/Roboto-Regular.ttf",
    bold: "fonts/roboto/Roboto-Medium.ttf",
    italics: "fonts/roboto/Roboto-Italic.ttf",
    bolditalics: "fonts/roboto/Roboto-MediumItalic.ttf",
  },
};
const bloodGroup = ["A", "B", "O", "AB"];
const bloodRhesus = ["+", "-"];

module.exports.showSon = async (req, res) => {
  // get the patient id from the patients table
  const { id } = req.params;
  const [medecins, techniciens, patient, algeria, reports] = await Promise.all([
    Staff.find({ fonction: "Medecin" }),
    Staff.find({ fonction: "technicien cathlab" }),
    Patient.findById(id),
    Country.find({}),
    Report.find({}),
  ]);
  const states = algeria[0].states;
  let medicalInfo = { saturation: "", ta: "", poids: "", taille: "" };
  // take the last value of the consultation
  if (patient.consultation.length >= 1) {
    medicalInfo.saturation = patient.sortedConsultation[
      patient.consultation.length - 1
    ].saturation
      ? patient.sortedConsultation[patient.consultation.length - 1].saturation +
        " %"
      : "/";
    medicalInfo.ta = patient.sortedConsultation[patient.consultation.length - 1]
      .ta
      ? patient.sortedConsultation[patient.consultation.length - 1].ta
      : "/";
    medicalInfo.taille = patient.sortedConsultation[
      patient.consultation.length - 1
    ].taille
      ? patient.sortedConsultation[patient.consultation.length - 1].taille +
        " cm"
      : "/";
    medicalInfo.poids = patient.sortedConsultation[
      patient.consultation.length - 1
    ].poids
      ? patient.sortedConsultation[patient.consultation.length - 1].poids +
        " kg"
      : "/";
  } else {
    medicalInfo.saturation = "/";
    medicalInfo.ta = "/";
    medicalInfo.taille = "/";
    medicalInfo.poids = "/";
  }
  // send it to the client
  res.render("patient/show", {
    patient,
    moment,
    medecins,
    techniciens,
    states,
    reports,
    conduitemedicales: conduiteMedicale.conduitemedicale,
    bloodGroup,
    bloodRhesus,
    medicalInfo,
    actes,
  });
  // res.send(patient)
};

module.exports.createSon = async (req, res) => {
  const { id } = req.params;
  let {
    firstname,
    lastname,
    father,
    birthdate,
    gender,
    medecinref,
    phone,
    phone2,
    status,
    wilaya,
    city,
    relation,
  } = req.body.patient;
  console.log("relation: " + relation);
  console.log("test: " + relation != "Fils" || relation != "Foetus");

  let isParent = {
    relation: "Fils",
    activate: false,
    idMother: null,
    idFather: null,
  };
  if (relation == "Foetus") {
    firstname = relation;
    lastname = "";
    isParent.idMother = id;
  }
  if (relation != "Fils" && relation != "Foetus") {
    isParent.activate = true;
    isParent.relation = relation;
  } else {
    isParent.activate = false;
    isParent.relation = relation;
  }
  const { blood } = req.body;
  if (phone2 === "") {
    phone2 = "/";
  }
  if (father === "") {
    father = "/";
  }

  const patient = new Patient({
    firstname:
      firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
    lastname:
      lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
    father: father.charAt(0).toUpperCase() + father.slice(1).toLowerCase(),
    birthdate,
    blood,
    phone,
    phone2,
    medecinref,
    gender,
    status,
    wilaya,
    city,
    isParent: isParent,
   
    createdBy: {
      user: req.user._id,
    },
  });

  await Promise.all([
    Patient.findByIdAndUpdate(
      { _id: id },
      {
        $addToSet: { sons: patient._id },
      }
    ),
    patient.save(),
  ]);

  req.flash("success", "Fils ajouté avec succès");
  res.redirect("/patient/" + id);
};
module.exports.updateSon = async (req, res) => {
  const { id } = req.params;
  let {
    firstname,
    lastname,
    father,
    birthdate,
    gender,
    medecinref,
    phone,
    phone2,
    wilaya,
    city,
    status,
  } = req.body.patient;
  const { blood } = req.body;

  if (phone2 === "") {
    phone2 = "/";
  }
  if (father === "") {
    father = "/";
  }

  await Patient.findByIdAndUpdate(
    id,
    {
      firstname:
        firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
      lastname:
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
      father: father.charAt(0).toUpperCase() + father.slice(1).toLowerCase(),
      birthdate,
      blood,
      phone,
      phone2,
      medecinref,
      gender,
      wilaya,
      city,
      status: !status ? "" : "Décédé",
      $push: {
        updatedBy: {
          user: req.user._id,
        },
      },
    },
    { new: true }
  );
  req.flash("success", "Patient a été modifié avec succès");
  res.redirect("back");
};
module.exports.deleteSon = async (req, res) => {
  const { id, idSon } = req.params;

  // this make the patient inactive
  await Patient.findByIdAndDelete(idSon);
  await Patient.findByIdAndUpdate({ _id: id }, { $pull: { sons: idSon } });

  // await Patient.findByIdAndDelete(id);
  req.flash("success", "Fils a été supprimé");
  res.redirect("/patient/" + id);
  // res.send("deleted")
};
