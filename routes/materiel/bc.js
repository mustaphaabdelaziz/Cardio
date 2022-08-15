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
} = require("../../controller/materiel/bc");
const catchAsync = require("../../utils/catchAsync");
router.route("/").get(catchAsync(showbcpatient)).post(catchAsync(addBc));
// /kt/bc/:idpatient/:idbc
router
  .route("/:idbc")
  .get(catchAsync(showbc))
  .post(catchAsync(addArticleBC))
  .put(catchAsync(updatePatientBc))
  .delete(catchAsync(deletePatientBc));

// patient/:idp/bc/:idbc

module.exports = router;
