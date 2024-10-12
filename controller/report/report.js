const moment = require("moment");
const Report = require("../model/report");
module.exports.showReport = async (req, res) => {
  const { id, idacte, idcomp } = req.params;
  const patient = await Patient.findById(idacte);
  res.send(patient);
};
module.exports.addReport = async (req, res) => {
  // let {  } = req.body.model;
  let { save, title } = req.body;

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
  if (save == "on") {
    const report = new Report({
      type: title,
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
    });
    await report.save();
  }
  const patient = await Patient.findOneAndUpdate(
    { _id:id, "consultation._id": idacte },
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

 const redirectUrl = req.get("Referrer") || "/";
  req.flash("success", "Acte ajouté avec succès");
  res.redirect(redirectUrl);
  res.redirect("/patient");
};

module.exports.updateReport = async (req, res) => {
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
    { _id:id, "consultation._id": idacte },
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
module.exports.deleteReport = async (req, res) => {
  const { id, idacte } = req.params;
  await Patient.findOneAndUpdate(
    { _id:id, "consultation._id": idacte },
    { $set: { "consultation.$.compterendu": { isEmpty: true } } },
    { new: true }
  );
  req.flash("success", "Compte Rendu à été supprimé avec succès");
  res.redirect(`/patient/${id}`);
  // res.send("sent from compteRendu")
};
