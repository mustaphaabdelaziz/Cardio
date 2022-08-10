const moment = require("moment");
const Bc = require("../../model/materiel/bc");
const Patient = require("../../model/patient");
const Materiel = require("../../model/materiel/materiel");

module.exports.showbcpatient = async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  const bcs = await Bc.find({ patient: id });
    const materials = await Materiel.find({});
  // res.send(bcs);
  res.render("materiel/kt/bc/index", { bcs, patient, moment,materials });
};
module.exports.showbc = async (req, res) => {
  const { id, idbc } = req.params;
  const patient = await Patient.findById(id);
  const bc = await Bc.findById(idbc);
  const materials = await Materiel.find({});

  res.render("materiel/kt/bc/show", { bc, patient, moment, materials });
};

module.exports.addBc = async (req, res) => {
  let { date } = req.body.bc;
  const { id } = req.params;

  const bc = new Bc({ date, patient: id });
  await bc.save();
  const redirectUrl = `back`;
  req.flash("success", "Bc a été ajouté avec succès");
  res.redirect(redirectUrl);
};
module.exports.addArticleToBC = async (req, res) => {
  let { designation, qte } = req.body.articles;
  const { id, idbc } = req.params;
  console.log(designation, qte);

  const bc = await Bc.findByIdAndUpdate(
    idbc,
    {
      $push: {
        articles: {
          designation,
          qte,
        },
      },
    },
    { new: true }
  );

  const redirectUrl = `back`;
  req.flash("success", "Bc a été ajouté avec succès");
  res.redirect(redirectUrl);
};

module.exports.deleteKtBc = async (req, res) => {
  const { id, idbc } = req.params;
  const kt = await Bc.findByIdAndUpdate(
    id,
    { $pull: { bc: { _id: idbc } } },
    { new: true }
  );

  req.flash("success", "Bc à été supprimé avec succès");
  res.redirect(`/kts/${id}`);
};
module.exports.updateKtBc = async (req, res) => {
  const { id, idbc } = req.params;

  const {
    etat,
    serie,
    lot,
    marque,
    ddp,
    dateachat,
    quantite,
    fournisseur,
    bc,
    bl,
    fc,
  } = req.body.bc;

  let kt = await Bc.updateOne(
    {
      id,
      "bc._id": idbc,
    },
    {
      $set: {
        "bc.$.etat": etat,
        "bc.$.serie": serie,
        "bc.$.lot": lot,
        "bc.$.marque": marque,
        "bc.$.dateachat": dateachat,
        "bc.$.ddp": ddp,
        "bc.$.quantite": quantite,
        "bc.$.fournisseur": fournisseur,
        "bc.$.bc": bc,
        "bc.$.bl": bl,
        "bc.$.fc": fc,
      },
    }
  );

  // res.send(kt);
  req.flash("success", "Bc à été modifé avec succès");
  res.redirect(`/kts/${id}`);
};
