const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware/middleware");
const {
  listeStaff,
  createStaff,
  showStaff,
  deleteStaff,
  updateStaff,
  generatepdf,
} = require("../controller/staff");
router.route("/generatepdf").get(isLoggedIn,catchAsync(generatepdf));
router.route("/").get(listeStaff).post(isLoggedIn,createStaff);
router
  .route("/:id")
  .get(isLoggedIn,showStaff)
  .delete(catchAsync(isLoggedIn,deleteStaff))
  .put(catchAsync(isLoggedIn,updateStaff));

module.exports = router;
