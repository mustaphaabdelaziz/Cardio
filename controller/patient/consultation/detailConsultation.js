const moment = require("moment");
const path = require("path");
const fs = require("fs");
const Patient = require("../../../model/patient/patient");
const Report = require("../../../model/patient/compteRendu");
const Country = require("../../../model/data/country");
const conduiteMedicale = require("../../../seeds/conduiteMedicale");
const listService = require("../../../seeds/list_service");
const bloodGroup = ["A", "B", "O", "AB"];
const bloodRhesus = ["+", "-"];

module.exports.showPatientConsulation = async (req, res) => {
  let { id, idacte } = req.params;
  const [patient, reports, algeria] = await Promise.all([
    Patient.findById(id),
    Report.find({}),
    Country.find({}),
  ]);
  const states = algeria[0].states;
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
    reports,
    states,
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

  const relativePath = path.relative("G:/Patients", req.file.path);
  const urlSafePath = encodeURIComponent(relativePath.replace(/\\/g, "/"));

  const document = {
    service: req.body.service,
    acte: req.body.acte,
    filename: req.file.filename,
    path: `/patients/${urlSafePath}`,
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

  const redirectUrl = req.get("Referrer") || "/";
  req.flash("success", "Les détails ont été ajouté avec succès");
  res.redirect(redirectUrl);
};
module.exports.editFile = async (req, res) => {
  try {
    const { id, idacte, iddocument } = req.params;
    const patient = await Patient.findOne({
      _id: id,
      "consultation._id": idacte,
    });

    if (!patient) {
      req.flash("error", "Patient or consultation not found.");
      return res.redirect("/");
    }

    const document = patient.consultation
      .find((c) => c._id.toString() === idacte)
      .documents.find((d) => d._id.toString() === iddocument);

    if (!document) {
      req.flash("error", "Document not found.");
      return res.redirect("/");
    }

    // Delete the old file if a new one is uploaded
    if (req.file) {
      const oldFilePath = path.join("G:/Patients", document.path);
      fs.unlinkSync(oldFilePath); // Delete the old file

      document.filename = req.file.filename;
      document.path = `/patients/${req.file.path}`;
    }

    // Update document metadata (service, acte, etc.)
    document.service = req.body.service;
    document.acte = req.body.acte;

    await patient.save();

    req.flash("success", "Document updated successfully.");
    res.redirect(`/patient/${id}/acte/${idacte}`);
  } catch (error) {
    console.error("Error editing file:", error);
    req.flash("error", "An error occurred while editing the file.");
    res.redirect("/");
  }
};
module.exports.deleteFile = async (req, res) => {
  try {
    const { id, idacte, iddocument } = req.params;
    const { documentPath } = req.body;

    // Get the file path from the document
    const filePath = decodeURIComponent(documentPath);

    // Delete the file from the file system
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
        return res.status(500).send("Failed to delete file");
      }

      // Remove the document from the consultation's documents array
      await Patient.findOneAndUpdate(
        { _id: id, "consultation._id": idacte },
        { $pull: { "consultation.$.documents": { _id: iddocument } } },
        { new: true }
      );
      // Send success response
      res.redirect(`/patient/${id}/acte/${idacte}`);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};
