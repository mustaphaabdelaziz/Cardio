const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../../middleware/middleware");
const {
  addmedicament,
  showmedicaments,
  updatemedicament,
  removemedicament,
} = require("../../controller/medicament/medicament");
const catchAsync = require("../../utils/catchAsync");
router
  .route("/")
  .get(isLoggedIn, catchAsync(showmedicaments))
  .post(catchAsync(addmedicament));

router
  .route("/:id")
  .delete(isLoggedIn, catchAsync(removemedicament))
  .put(isLoggedIn, catchAsync(updatemedicament));

module.exports = router;
