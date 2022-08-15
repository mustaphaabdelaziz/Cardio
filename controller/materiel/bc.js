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

module.exports.deletePatientBc = async (req, res) => {
  const { id, idbc } = req.params;
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
