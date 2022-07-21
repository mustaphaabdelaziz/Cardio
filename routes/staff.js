const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  creationform,
  listeStaff,
  createStaff,
  showStaff,
  deleteStaff,
  updateStaff,
  generatepdf,
} = require("../controller/staff");
router.route("/generatepdf").get(catchAsync(generatepdf));
router.route("/new").get(creationform);
router.route("/").get(listeStaff).post(createStaff);
router
  .route("/:id")
  .get(showStaff)
  .delete(catchAsync(deleteStaff))
  .put(catchAsync(updateStaff));

module.exports = router;
