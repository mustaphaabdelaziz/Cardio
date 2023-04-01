const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middleware/middleware");
const {
  listeStaff,
  createStaff,
  showStaff,
  deleteStaff,
  updateStaff,
  generatepdf,
} = require("../../controller/staff/staff");
router.route("/generatepdf").get(isLoggedIn, catchAsync(generatepdf));
router
  .route("/")
  .get(catchAsync(listeStaff))
  .post(isLoggedIn, catchAsync(createStaff));
router
  .route("/:id")
  .get(isLoggedIn, catchAsync(showStaff))
  .delete(isLoggedIn, catchAsync(deleteStaff))
  .put(isLoggedIn, catchAsync(updateStaff));

module.exports = router;
