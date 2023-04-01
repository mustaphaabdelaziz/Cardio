const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showComptRendu,
  addCompteRendu,
  updateCompteRendu,
  deleteCompteRendu,
} = require("../../../../controller/patient/consultation/compteRendu/compteRendu");
const catchAsync = require("../../../../utils/catchAsync");
const { isLoggedIn } = require("../../../../middleware/middleware");
router
  .route("/")
  .post(isLoggedIn, catchAsync(addCompteRendu))
  .get(isLoggedIn, catchAsync(showComptRendu))
  .delete(isLoggedIn, catchAsync(deleteCompteRendu))
  .put(isLoggedIn, catchAsync(updateCompteRendu));

module.exports = router;
