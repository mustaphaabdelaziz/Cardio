const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  createFournisseur,
  listeFournisseur,
  deleteFournisseur,
  updateFournisseur,
  generatepdf,
} = require("../../controller/materiel/fournisseur");
const { isLoggedIn } = require("../../middleware/middleware");
router.route("/generatepdf").get(isLoggedIn, catchAsync(generatepdf));

router
  .route("/")
  .get(isLoggedIn, catchAsync(listeFournisseur))
  .post(isLoggedIn, catchAsync(createFournisseur));
router
  .route("/:id")
  .delete(isLoggedIn, catchAsync(deleteFournisseur))
  .put(isLoggedIn, catchAsync(updateFournisseur));

module.exports = router;
