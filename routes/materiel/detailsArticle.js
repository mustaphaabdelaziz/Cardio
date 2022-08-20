const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addDetail,
  showdetail,
  updatedetail,
  deletedetail,
} = require("../../controller/materiel/detailsArticle");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middleware/middleware");
router
  .route("/")
  .get(isLoggedIn, catchAsync(showdetail))
  .post(isLoggedIn, catchAsync(addDetail));
router
  .route("/:iddetail")
  .delete(isLoggedIn, catchAsync(deletedetail))
  .put(isLoggedIn, catchAsync(updatedetail));
// patient/:idp/acte/:idacte

module.exports = router;
