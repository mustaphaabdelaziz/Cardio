const moment = require("moment");
const Patient = require("../../../model/patient/patient");
const Report = require("../../../model/patient/compteRendu");
const conduiteMedicale = require("../../../seeds/conduiteMedicale");
const listService = require("../../../seeds/list_service");
const patient = require("../../../model/patient/patient");
const bloodGroup = ["A", "B", "O", "AB"];
const bloodRhesus = ["+", "-"];

module.exports.showPatientConsulation = async (req, res) => {
  let { id, idacte } = req.params;
  const uid = (() => (ids = 0, () => ids++))();
  console.log(uid())
  const [patient] = await Promise.all([Patient.findById(id)]);

  let medicalInfo = { saturation: "", ta: "", poids: "", taille: "" };
  let patientConsultation;
  if (patient.consultation.length >= 1) {
    patientConsultation = patient.consultation.find((consultation) => {
      return consultation.id === idacte;
    });
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
  res.render("patient/consultation/details/show", {
    idacte,
    patient,
    patientConsultation,
    moment,
    conduitemedicales: conduiteMedicale.conduitemedicale,
    examens: listService.examens,
    bloodGroup,
    bloodRhesus,
    medicalInfo,
  });
  // res.send(patientConsultation.id);
};
module.exports.uploadFiles = async (req, res) => {
  const { id, idacte } = req.params;
  const document = {
    service: req.body.service,
    acte: req.body.acte,
    filename: req.file.filename,
    path: req.file.path,
  };
  const query = {
    $set: {
      $push: { "consultation.$.documents": document },
    },
  };
  const patient = await Patient.findOneAndUpdate(
    { _id: id, "consultation._id": idacte },
    {
      $push: { "consultation.$.documents": document },
    },
    { new: true }
  );

  const redirectUrl = `back`;
  req.flash("success", "Les détails ont été ajouté avec succès");
  res.redirect(redirectUrl);
};
