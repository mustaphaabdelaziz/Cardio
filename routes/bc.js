const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  // showcform,
  addBc,
  showbc,
  showbcpatient
  // deleteMaterielBc,
  // updateMaterielBc,
} = require("../controller/bc");
const catchAsync = require("../utils/catchAsync");
router.route("/").get(catchAsync(showbcpatient)).post(catchAsync(addBc));

router.route("/:idbc").get(catchAsync(showbc))

// patient/:idp/bc/:idbc

module.exports = router;
