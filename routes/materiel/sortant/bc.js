/* this routes is used to manipulate the bcs */
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  // showcform,
  addBc,
  showbc,
  showbcpatient,
  addArticleBC,
  updatePatientBc,
  deletePatientBc,
} = require("../../../controller/materiel/sortant/bc");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router
  .route("/")
  .get(isLoggedIn, catchAsync(showbcpatient))
  .post(isLoggedIn, catchAsync(addBc));
// /kt/bc/:idpatient/:idbc
router
  .route("/:idbc")
  .get(isLoggedIn, catchAsync(showbc))
  .post(isLoggedIn, catchAsync(addArticleBC))
  .put(isLoggedIn, catchAsync(updatePatientBc))
  .delete(isLoggedIn, catchAsync(deletePatientBc));

// patient/:idp/bc/:idbc

module.exports = router;
