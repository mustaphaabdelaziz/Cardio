const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  creationform,
  listepatient,
  createpatient,
  showpatient,
  deletePatient,
  updatePatient,
  generatepdf,
  createandreturn,
} = require("../controller/patient");

router.route("/generatepdf").get(catchAsync(generatepdf));
router.route("/new").get(creationform)
router.route("/").get(listepatient).post(createpatient);
router.route("/patient/new").post(createandreturn)
router
  .route("/:id")
  .get(showpatient)
  .delete(catchAsync(deletePatient))
  .put(catchAsync(updatePatient));
module.exports = router;
