const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showcform,
  addActe,
  showc,
  deletePatientActe,
  updatePatientActe,
} = require("../controller/consultation");
const catchAsync = require("../utils/catchAsync");
router.route("/").post(catchAsync(addActe));
router.route("/new").get(catchAsync(showcform));
router
  .route("/:idacte")
  .get(catchAsync(showc))
  .delete(catchAsync(deletePatientActe))
  .put(catchAsync(updatePatientActe));

// patient/:idp/acte/:idacte

module.exports = router;
