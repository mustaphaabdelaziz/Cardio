const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showReport,
  addReport,
  updateReport,
  deleteReport,
} = require("../controller/report");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/middleware");
router
  .route("/")
  .post(isLoggedIn, catchAsync(addReport))
  .get(isLoggedIn, catchAsync(showReport))
  .delete(isLoggedIn, catchAsync(deleteReport))
  .put(isLoggedIn, catchAsync(updateReport));

module.exports = router;
