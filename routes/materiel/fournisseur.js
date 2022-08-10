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
router.route("/generatepdf").get(catchAsync(generatepdf));

router.route("/").get(listeFournisseur).post(catchAsync(createFournisseur));
router
  .route("/:id")
  .delete(catchAsync(deleteFournisseur))
  .put(catchAsync(updateFournisseur));

module.exports = router;
