const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAssistant } = require("../middleware/middleware");
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

router
  .route("/generatepdf")
  .get(isLoggedIn, isAssistant, catchAsync(generatepdf));
router
  .route("/generatepdf/:id")
  .get(isLoggedIn, isAssistant, catchAsync(generatePatientpdf));
router.route("/new").get(isLoggedIn, isAssistant, catchAsync(creationform));
router
  .route("/")
  .get( isLoggedIn, isAssistant,catchAsync(listepatient))
  .post(isLoggedIn, isAssistant, catchAsync(createpatient));
router
  .route("/patient/new")
  .post(isLoggedIn, isAssistant, catchAsync(createandreturn));
router.route("/refactor").get(isLoggedIn, isAssistant, catchAsync(refactoring));
router
  .route("/:id")
  .get( catchAsync(showpatient))
  .delete(isLoggedIn, isAssistant, catchAsync(deletePatient))
  .put(isLoggedIn, isAssistant, catchAsync(updatePatient));

module.exports = router;
