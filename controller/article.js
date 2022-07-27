const moment = require("moment");
const Materiel = require("../model/materiel");

module.exports.showcform = async (req, res) => {
  res.send("materiel/new");
};

module.exports.showarticle = async (req, res) => {
  // get the materiel id from the materiels table
  const { id } = req.params;
  // find the materiel in the database

  const materiel = await Materiel.findById(id);
  // send it to the client
  res.render("materiel/article/show", { materiel });
};

module.exports.addArticle = async (req, res) => {
  let { dateachat, quantite,articleref,articledesignation } = req.body.article;
  const { id } = req.params;

  const materiel = await Materiel.findByIdAndUpdate(
    id,
    {
      $push: {
        article: {
          quantite,
          dateachat,
          ref: articleref,
          designation: articledesignation,
        },
      },
    },
    { new: true }
  );

  const redirectUrl = `back`;
  req.flash("success", "Article a été ajouté avec succès");
  res.redirect(redirectUrl);
  // res.redirect("/materiel")
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

  const { dateachat, quantite,articleref,articledesignation } =
    req.body.article;
  console.log(dateachat, quantite,articleref,articledesignation);
  console.log(id, idarticle);
  let materiel;

 
    materiel = await Materiel.updateOne(
      {
        id,
        "article._id": idarticle,
      },
      {
        $set: {
          "article.$.dateachat": dateachat,
          "article.$.quantite": quantite,
          "article.$.ref": articleref,
          "article.$.designation": articledesignation,
          
        },
      }
    );
  
  // res.send(materiel);
  req.flash("success", "Article à été modifé avec succès");
  res.redirect(`/materiels/${id}`);
};
