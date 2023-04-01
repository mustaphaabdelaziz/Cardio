const moment = require("moment");
const Medicament = require("../../model/medicament/medicament");

module.exports.showmedicaments = async (req, res) => {
  // get the materiel id from the materiels table
  console.log("hi");

  // find the materiel in the database
  const medicaments = await Medicament.find({});
  // send it to the client
  res.render("medicament/index", { medicaments });
};
module.exports.addmedicament = async (req, res) => {
  // get the materiel id from the materiels table
  const { commercialname, dci,dosage, form, therapeutique, laboratoire } =
    req.body.medicament;
  const medicaments = new Medicament({
    commercialname,
    dci,
    dosage,
    form,
    therapeutique,
    laboratoire,
  });
  await medicaments.save();
  req.flash("success", "Médicament a été ajouté avec succès");
  res.redirect("/medicaments");
};
module.exports.updatemedicament = async (req, res) => {
  // get the materiel id from the materiels table
  res.send("updatemedicaments");
};
module.exports.removemedicament = async (req, res) => {
  const { id } = req.params;
  
  const medicament = await Medicament.findByIdAndDelete(id);

  req.flash("success", "Medicament à été supprimé avec succès");
  res.redirect(`/medicaments`);
 
};
