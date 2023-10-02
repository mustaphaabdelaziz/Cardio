const moment = require("moment");
const Bc = require("../../../model/materiel/bc");
const Patient = require("../../../model/patient/patient");
const Materiel = require("../../../model/materiel/materiel");

module.exports.showBc = async (req, res) => {
  const { id, idbc } = req.params;
  const patient = await Patient.findById(id);
  const bc = await Bc.findById(idbc);
  const materials = await Materiel.find({});

  res.render("materiel/sortant/kt/bc/article/index", {
    bc,
    patient,
    moment,
    materials,
  });
};
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
          marque: marque,
          "detail.serie": serialN,
        },
      },
    },
    {
      $set: {
        "article.$[outer].detail.$[inner].taken": true,
      },
    },
    { arrayFilters: [{ "inner.serie": serialN }, { "outer.marque": marque }] }
  ).then((result, err) => {
    if (err) {
      console.err("Error updating detail: " + err);
      // res.send(result);
    } else {
      const redirectUrl = `back`;
      req.flash("success", "Bc a été ajouté avec succès");
      res.redirect(redirectUrl);
    }
  });
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
          marque: marque,
          "detail.serie": serie,
        },
      },
    },
    {
      $set: {
        "article.$[outer].detail.$[inner].taken": false,
      },
    },
    { arrayFilters: [{ "inner.serie": serie }, { "outer.marque": marque }] }
  ).then((result, err) => {
    if (err) {
      console.error("Error updating detail: " + err);
      // res.send(result);
    } else {
      const redirectUrl = `back`;
      req.flash("success", "Bc a été ajouté avec succès");
      res.redirect(redirectUrl);
    }
  });
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
