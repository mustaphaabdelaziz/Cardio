const moment = require("moment");
const Patient = require("../model/patient");
module.exports.showComptRendu = async (req, res) => {
  const { id, idacte, idcomp } = req.params;
  const patient = await Patient.findById(idacte);
  res.send(patient);
};
module.exports.addCompteRendu = async (req, res) => {
  let {
    atcd,
    quality,
    situs,
    aorte,
    valveAortique,
    oreilletteGauche,
    sia,
    valveMitrale,
    siv,
    cavitesDroites,
    tricuspide,
    arterePulmonaire,
    pericarde,
    conclusion,
    conduiteMedicale,
  } = req.body.compteRendu;
  let { motif, dtd, ventGsiv, fe } = req.body.ventriculeGauche;
  const { id, idacte } = req.params;
  const patient = await Patient.findOneAndUpdate(
    { id, "consultation._id": idacte },
    {
      $set: {
        "consultation.$.compterendu": {
          isEmpty: false,
          atcd,
          quality,
          indication: {
            situs,
            aorte,
            valveAortique,
            oreilletteGauche,
            sia,
            valveMitrale,
            ventriculeGauche: {
              motif,
              dtd,
              siv: ventGsiv,
              fe,
            },
            siv,
            cavitesDroites,
            tricuspide,
            arterePulmonaire,
            pericarde,
          },
          conclusion,
          conduiteMedicale,
        },
      },
    },
    { new: true }
  );

  const redirectUrl = `back`;
  req.flash("success", "Acte ajouté avec succès");
  res.redirect(redirectUrl);
  // res.redirect("/patient")
};

module.exports.updateCompteRendu = async (req, res) => {
  const { id, idacte } = req.params;

  let {
    atcd,
    quality,
    situs,
    aorte,
    valveAortique,
    oreilletteGauche,
    sia,
    valveMitrale,
    siv,
    cavitesDroites,
    tricuspide,
    arterePulmonaire,
    pericarde,
    conclusion,
    conduiteMedicale,
  } = req.body.compteRendu;
  let { motif, dtd, ventGsiv, fe } = req.body.ventriculeGauche;
  const patient = await Patient.findOneAndUpdate(
    { id, "consultation._id": idacte },
    {
      $set: {
        "consultation.$.compterendu": {
          atcd,
          quality,
          indication: {
            situs,
            aorte,
            valveAortique,
            oreilletteGauche,
            sia,
            valveMitrale,
            ventriculeGauche: {
              motif,
              dtd,
              siv: ventGsiv,
              fe,
            },
            siv,
            cavitesDroites,
            tricuspide,
            arterePulmonaire,
            pericarde,
          },
          conclusion,
          conduiteMedicale,
        },
      },
    },
    { new: true }
  );
  // res.send(patient);
  req.flash("success", "Acte à été modifé avec succès");
  res.redirect(`/patient/${id}`);
};
module.exports.deleteCompteRendu = async (req, res) => {
  const { id, idacte } = req.params;
  const patient = await Patient.findOneAndUpdate(
    { id, "consultation._id": idacte },
    { $set: { "consultation.$.compterendu": { isEmpty: true } } },
    { new: true }
  );

  req.flash("success", "Compte Rendu à été supprimé avec succès");
  res.redirect(`/patient/${id}`);
  // res.send("sent from compteRendu")
};
