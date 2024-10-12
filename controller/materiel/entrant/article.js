const moment = require("moment");
const Materiel = require("../../../model/materiel/materiel");
const Fournisseur = require("../../../model/materiel/fournisseur");

module.exports.showcform = async (req, res) => {
  res.send("materiel/new");
};

module.exports.showarticle = async (req, res) => {
  // get the materiel id from the materiels table
  const { id } = req.params;
  // find the materiel in the database

  const materiel = await Materiel.findById(id);
  const fournisseurs = await Fournisseur.find({});
  // send it to the client
  res.render("materiel/entrant/article/show", { materiel, fournisseurs });
};

module.exports.addArticle = async (req, res) => {
  let {
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
  } = req.body.article;
  const { id } = req.params;

  const materiel = await Materiel.findByIdAndUpdate(
    id,
    {
      $push: {
        article: {
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
        },
      },
    },
    { new: true }
  );

  const redirectUrl = req.get("Referrer") || "/";
  req.flash("success", "Article a été ajouté avec succès");
  res.redirect(redirectUrl);
};
module.exports.deleteMaterielArticle = async (req, res) => {
  const { id, idarticle } = req.params;
  const materiel = await Materiel.findByIdAndUpdate(
    id,
    { $pull: { article: { _id: idarticle } } },
    { new: true }
  );

  req.flash("success", "Article à été supprimé avec succès");
  res.redirect(`/materiels/${id}`);
};
module.exports.updateMaterielArticle = async (req, res) => {
  const { id, idarticle } = req.params;

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
  } = req.body.article;

  let materiel;

  materiel = await Materiel.updateOne(
    {
      id,
      "article._id": idarticle,
    },
    {
      $set: {
        "article.$.etat": etat,
        "article.$.serie": serie,
        "article.$.lot": lot,
        "article.$.marque": marque,
        "article.$.dateachat": dateachat,
        "article.$.ddp": ddp,
        "article.$.quantite": quantite,
        "article.$.fournisseur": fournisseur,
        "article.$.bc": bc,
        "article.$.bl": bl,
        "article.$.fc": fc,
      },
    }
  );

  // res.send(materiel);
  req.flash("success", "Article à été modifé avec succès");
  res.redirect(`/materiels/${id}`);
};
