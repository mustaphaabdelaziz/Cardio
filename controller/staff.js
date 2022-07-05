const { request } = require("express")
const moment = require("moment")
const Staff = require("../model/staff")

module.exports.listeStaff = async (req, res) => {
    const staffs = await Staff.find({})
    res.render("staff/index", { staffs, moment })

}
module.exports.creationform = (req, res) => {
    res.render("staff/new")

}
module.exports.showStaff = async (req, res) => {
    // get the staff id from the staffs table
    const { id } = req.params
    // find the staff in the database
    const staff = await Staff.findById(id)
    // send it to the client
    res.render("staff/show", { staff, moment })
    // res.send(staff)
}

module.exports.createStaff = async (req, res) => {

    const { firstname, lastname, birthdate, gender, phone } = req.body.staff


    const staff = new Staff({ firstname, lastname, birthdate, phone, gender })
    await staff.save()
    req.flash("success", "Staff ajouté avec succès");
    res.redirect("/staff")

}
module.exports.showEditForm = async (req, res) => {

    res.render("staff/edit")
};
module.exports.updateStaff = async (req, res) => {
    const { id } = req.params;
    const { staff } = req.body;

    await Staff.findByIdAndUpdate(id, { ...staff }, { new: true });
    req.flash("success", "Staff a été modifié avec succès");
    res.redirect("/staff");
};
module.exports.deleteStaff = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    await Staff.findByIdAndDelete(id);
    req.flash("success", "Staff a été supprimé");
    res.redirect("/staff");
};
