const moment = require("moment");
const Patient = require("../../../model/patient/patient");
const Report = require("../../../model/patient/compteRendu");

module.exports.showcform = async (req, res) => {
  res.send("patient/new");
};

module.exports.showc = async (req, res) => {
  // get the patient id from the patients table
  const { id } = req.params;
  // find the patient in the database
  const patient = await Patient.findById(id);
  // send it to the client
  res.render("patient/show", { patient });
  // res.send(reports);
};

module.exports.addActe = async (req, res) => {
  let {
    dateacte,
    time,
    medecin,
    technicien,
    poids,
    taille,
    saturation,
    ta,
    acte,
    comment,
    status,
  } = req.body.consultation;
  const { id } = req.params;
  let tech, med;
  if (technicien) tech = technicien;
  if (medecin) med = medecin;
  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      $push: {
        consultation: {
          medecin: med,
          technicien: tech,
          date: dateacte,
          time: time,
          acte: acte,
          poids: poids,
          taille: taille,
          saturation: saturation,
          ta: ta,
          comment: comment,
          status: status,
          compterendu: {
            isEmpty: true,
          },
        },
      },
    },
    { new: true }
  );

  const redirectUrl = req.get("Referrer") || "/";
  req.flash("success", "Acte ajouté avec succès");
  res.redirect(redirectUrl);
  // res.redirect("/patient")
};
module.exports.deletePatientActe = async (req, res) => {
  const { id, idacte } = req.params;
  const patient = await Patient.findByIdAndUpdate(
    id,
    { $pull: { consultation: { _id: idacte } } },
    { new: true }
  );
  req.flash("success", "Acte à été supprimé avec succès");
  res.redirect(`/patient/${id}`);
  // res.send("sent from acte")
};
module.exports.updatePatientActe = async (req, res) => {
  const { id, idacte } = req.params;

  const {
    dateacte,
    time,
    acte,
    medecin,
    technicien,
    poids,
    taille,
    saturation,
    ta,
    comment,
    status,
  } = req.body.consultation;
  const state = status;
  let patient;
  const query = { _id: id, "consultation._id": idacte };
  const updateDocument = {
    $set: {
      "consultation.$.medecin": medecin,
      "consultation.$.technicien": technicien,
      "consultation.$.date": dateacte,
      "consultation.$.time": time,
      "consultation.$.acte": acte,
      "consultation.$.poids": poids,
      "consultation.$.taille": taille,
      "consultation.$.saturation": saturation,
      "consultation.$.ta": ta,
      "consultation.$.comment": comment,
      "consultation.$.status": state === "oui" ? state : "non",
    },
  };
  // both updateOne and findOneAndUpdate work
  patient = await Patient.updateOne(query, updateDocument, {
    rawResult: true,
  });
  // res.send(patient);
  req.flash("success", "Acte à été modifé avec succès");
  res.redirect(`/patient/${id}`);
};
