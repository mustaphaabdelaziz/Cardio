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
  refactoring,
} = require("../controller/patient");

router.route("/generatepdf").get(isLoggedIn, catchAsync(generatepdf));
router
  .route("/generatepdf/:id")
  .get(isLoggedIn, catchAsync(generatePatientpdf));
router.route("/new").get(isLoggedIn, catchAsync(creationform));
router
  .route("/")
  .get(isLoggedIn, catchAsync(listepatient))
  .post(isLoggedIn, catchAsync(createpatient));
router.route("/patient/new").post(isLoggedIn, catchAsync(createandreturn));
router.route("/refactor").get(isLoggedIn, catchAsync(refactoring));
router
  .route("/:id")
  .get(isLoggedIn, catchAsync(showpatient))
  .delete(isLoggedIn, catchAsync(deletePatient))
  .put(isLoggedIn, catchAsync(updatePatient));

module.exports = router;
