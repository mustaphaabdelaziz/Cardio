const moment = require("moment");
const Staff = require("../model/staff");

module.exports.listeStaff = async (req, res) => {
  const staffs = await Staff.find({});
  res.render("staff/index", { staffs, moment });
};
module.exports.creationform = (req, res) => {
  res.render("staff/index");
};
module.exports.showStaff = async (req, res) => {
  // get the staff id from the staffs table
  const { id } = req.params;
  // find the staff in the database
  const staff = await Staff.findById(id);
  // send it to the client
  res.render("staff/show", { staff, moment });
  // res.send(staff)
};

module.exports.createStaff = async (req, res) => {
  const { firstname, lastname, fonction, externe, phone, email } =
    req.body.staff;
  let phone1 = phone.trim();
  let email1 = email.trim();
  if (phone1 === "") {
    phone1 = "/";
  }
  if (email1 === "") {
    email1 = "/";
  }

  const staff = new Staff({
    firstname,
    lastname,
    fonction,
    phone: phone1,
    email: email1,
    externe,
  });
  await staff.save();
  req.flash("success", "Staff ajouté avec succès");
  res.redirect("/staffs");
};
module.exports.showEditForm = async (req, res) => {
  res.render("staffs/edit");
};
module.exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, fonction, phone, email, externe } =
    req.body.staff;
  const type = externe;
  let phone1 = phone.trim();
  let email1 = email.trim();
  if (phone1 === "") {
    phone1 = "/";
  }
  if (email1 === "") {
    email1 = "/";
  }
  if (type === "externe") {
    await Staff.findByIdAndUpdate(
      id,
      { firstname, lastname, fonction, phone:phone1, email:email1, externe},
      { new: true }
    );
  } else {
    await Staff.findByIdAndUpdate(
      id,
      { firstname, lastname, fonction, phone:phone1, email:email1, externe:"interne" },
      { new: true }
    );
  }

  req.flash("success", "Staff a été modifié avec succès");
  res.redirect("/staffs");
};
module.exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await Staff.findByIdAndDelete(id);
  req.flash("success", "Staff a été supprimé");
  res.redirect("/staffs");
};
