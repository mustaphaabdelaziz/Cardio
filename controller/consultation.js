const moment = require("moment");
const Patient = require("../model/patient");


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
  
};

module.exports.addActe = async (req, res) => {
  var { dateacte, medecin, technicien, acte, comment } = req.body.consultation;
  const { id } = req.params;
  const patient = await Patient.findByIdAndUpdate(
    id,
    {
      $push: {
        consultation: {
          medecin: medecin.charAt(0).toUpperCase() + medecin.slice(1).toLowerCase(),
          technicien: technicien.charAt(0).toUpperCase() + technicien.slice(1).toLowerCase(),
          date: dateacte,
          acte: acte,
          comment: comment,
        },
      },
    },
    { new: true }
  );

  const redirectUrl = `back`;
  req.flash("success", "Acte ajouté avec succès");
  res.redirect(redirectUrl);
};
module.exports.deletePatientActe = async (req, res) => {
  const { id, idacte } = req.params;
  const patient = await Patient.findByIdAndUpdate(
    id,
    { $pull: { consultation: { _id: idacte } } },
    { new: true }
  );
  console.log(patient.acknowledgement);
  req.flash("success", "Acte à été supprimé avec succès");
  res.redirect(`/patient/${id}`);
};
module.exports.updatePatientActe = async (req, res) => {
  const { id, idacte } = req.params;
  console.log("idacte", idacte);
  console.log("id", id);
  const { dateacte, acte, medecin, technicien, comment } = req.body.consultation;
  console.log(req.body.consultation);
  const patient = await Patient.updateOne(
    {
      id,
      "consultation._id": idacte,
    },
    {
      $set: {
        "consultation.$.date": dateacte,
        "consultation.$.acte": acte,
        "consultation.$.medecin": medecin,
        "consultation.$.technicien": technicien, 
        "consultation.$.comment": comment,
      },
    }
  );
  // res.send(patient);
  req.flash("success", "Acte à été modifé avec succès");
  res.redirect(`/patient/${id}`);
};
