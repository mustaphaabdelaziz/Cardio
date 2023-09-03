const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const { upload } = require("../../../storage/index");

const {
  showPatientConsulation,
  uploadFiles,
} = require("../../../controller/patient/consultation/detailConsultation");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router.route("/").get(isLoggedIn, catchAsync(showPatientConsulation));
router
  .route("/files")
  .post(isLoggedIn, upload.single("file"), catchAsync(uploadFiles));

module.exports = router;
