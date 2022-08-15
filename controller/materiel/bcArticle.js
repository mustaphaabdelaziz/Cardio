const moment = require("moment");
const Bc = require("../../model/materiel/bc");
const Patient = require("../../model/patient");
const Materiel = require("../../model/materiel/materiel");

module.exports.addArticleBC = async (req, res) => {
  let { designation, marque, serialN } = req.body.articles;
  const { id, idbc } = req.params;
  const bc = await Bc.findByIdAndUpdate(
    idbc,
    {
      $push: {
        articles: {
          designation,
          marque,
          serie: serialN,
        },
      },
    },
    { new: true }
  );
  Materiel.findOneAndUpdate(
    {
      article: {
        $elemMatch: {
          "detail.serie": serialN,
        },
      },
    },
    {
      $set: {
        "article.$[].detail.$[inner].taken": true,
      },
    },
    { arrayFilters: [{ "inner.serie": serialN }] },
    (err, result) => {
      if (err) {
        console.log("Error updating detail: " + err);
        // res.send(result);
      } else {
        const redirectUrl = `back`;
        req.flash("success", "Bc a été ajouté avec succès");
        res.redirect(redirectUrl);
      }
    }
  );
};

module.exports.deleteArticleBc = async (req, res) => {
  const { serie, marque } = req.query;
  const { id, idbc, idart } = req.params;
  const bc = await Bc.findByIdAndUpdate(
    idbc,
    {
      $pull: {
        articles: {
          _id: idart,
        },
      },
    },
    { new: true }
  );
  Materiel.findOneAndUpdate(
    {
      article: {
        $elemMatch: {
          "detail.serie": serie,
          "article.marque": marque,
        },
      },
    },
    {
      $set: {
        "article.$[outer].detail.$[inner].taken": false,
      },
    },
    { arrayFilters: [{ "inner.serie": serie }, { "outer.marque": marque }] },
    (err, result) => {
      if (err) {
        console.log("Error updating detail: " + err);
        // res.send(result);
      } else {
        const redirectUrl = `back`;
        req.flash("success", "Bc a été ajouté avec succès");
        res.redirect(redirectUrl);
      }
    }
  );
};
module.exports.updateArticleBc = async (req, res) => {
  const { id, idbc } = req.params;
  const { date } = req.body.bc;
  await Bc.findByIdAndUpdate(idbc, {
    $set: { date },
  });

  // res.send(kt);
  req.flash("success", "Bc à été modifé avec succès");
  res.redirect(`/kt/bc/${id}/`);
};
