const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const upload = require("../../../config/multerConfig");

const {
  showPatientConsulation,
  uploadFiles,
  editFile,
  deleteFile,
} = require("../../../controller/patient/consultation/detailConsultation");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router.route("/").get(isLoggedIn, catchAsync(showPatientConsulation));
router
  .route("/file")
  .post(isLoggedIn, upload.single("file"), catchAsync(uploadFiles));
router
  .route("/file/:iddocument")
  .put(isLoggedIn, upload.single("file"), catchAsync(editFile))
  .delete(isLoggedIn, catchAsync(deleteFile));

module.exports = router;
