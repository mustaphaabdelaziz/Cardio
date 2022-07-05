const moment = require("moment")
const underscore = require("underscore")
const Patient = require("../model/patient")



module.exports.showacteliste = async (req, res) => {
    const { id } = req.params
    const patients = await Patient.find({ "consultation.acte": { '$regex': new RegExp('^' + id + '$', 'i') } })
    // res.send(patients)
    res.render("patient/acte/index", { patients, acte: id, moment, underscore })

}
module.exports.filter = async (req, res) => {
    const { age } = req.query;
    const { acte } = req.query;
    if (age) {
        const patients = await Patient.find({ age: age })
        res.render("patient/acte/index", { patients, acte: id, moment, underscore })
    } else {
        const { start, end } = req.query;
        const patients = await Patient.find({
            "consultation.acte": { $gte: start, $lte: end },
        })
        res.render("patient/acte/index", { patients, acte: id, moment, underscore })
    }
};




