const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/middleware");
const {
  creationform,
  listepatient,
  createpatient,
  showpatient,
  deletePatient,
  updatePatient,
  generatepdf,
  createandreturn,
  generatePatientpdf,
} = require("../controller/patient");

router.route("/generatepdf").get(isLoggedIn, catchAsync(generatepdf));
router
  .route("/generatepdf/:id")
  .get(isLoggedIn, catchAsync(generatePatientpdf));
router.route("/new").get(isLoggedIn, creationform);
router.route("/").get(isLoggedIn, listepatient).post(isLoggedIn, createpatient);
router.route("/patient/new").post(isLoggedIn, createandreturn);
router
  .route("/:id")
  .get(isLoggedIn, showpatient)
  .delete(catchAsync(isLoggedIn, deletePatient))
  .put(catchAsync(isLoggedIn, updatePatient));
module.exports = router;
