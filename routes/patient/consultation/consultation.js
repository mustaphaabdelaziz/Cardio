const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showcform,
  addActe,
  showc,
  deletePatientActe,
  updatePatientActe,
} = require("../../../controller/patient/consultation/consultation");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router.route("/").post(isLoggedIn,catchAsync(addActe));
router.route("/new").get(isLoggedIn,catchAsync(showcform));
router
  .route("/:idacte")
  .get(isLoggedIn,catchAsync(showc))
  .delete(isLoggedIn,catchAsync(deletePatientActe))
  .put(isLoggedIn,catchAsync(updatePatientActe));

// patient/:idp/acte/:idacte

module.exports = router;
