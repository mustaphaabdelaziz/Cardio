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
  res.render("materiel/kt/bc/index", { bcs, patient, moment, materials });
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

module.exports.deletePatientBc = async (req, res) => {
  const { id, idbc } = req.params;
  // get all the articles of the bc
  const articles = await Bc.findById(idbc, { articles: 1 });
  /* for each article in the bc 
  set the taken property to false in the articles table */
  articles.articles.forEach((article) => {
    Materiel.findOneAndUpdate(
      {
        article: {
          $elemMatch: {
            marque: article.marque,
            "detail.serie": article.serie,
          },
        },
      },
      {
        $set: {
          "article.$[outer].detail.$[inner].taken": false,
        },
      },
      {
        arrayFilters: [
          { "inner.serie": article.serie },
          { "outer.marque": article.marque },
        ],
      },
      (err, result) => {
        if (err) {
          console.log("Error updating detail: " + err);
          // res.send(result);
        } else {
          console.log("Detail updated");
        }
      }
    );
  });
  await Bc.findByIdAndDelete(idbc);
  req.flash("success", "Bc à été supprimé avec succès");
  res.redirect(`/kt/bc/${id}`);
};
module.exports.updatePatientBc = async (req, res) => {
  const { id, idbc } = req.params;
  const { date } = req.body.bc;
  await Bc.findByIdAndUpdate(idbc, {
    $set: { date },
  });

  // res.send(kt);
  req.flash("success", "Bc à été modifé avec succès");
  res.redirect(`/kt/bc/${id}/`);
};
