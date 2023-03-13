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
const { isLoggedIn,isAcheteur } = require("../../middleware/middleware");
router.route("/generatepdf").get(isLoggedIn,isAcheteur, catchAsync(generatepdf));

router
  .route("/")
  .get(isLoggedIn,isAcheteur, catchAsync(listeFournisseur))
  .post(isLoggedIn,isAcheteur, catchAsync(createFournisseur));
router
  .route("/:id")
  .delete(isLoggedIn,isAcheteur, catchAsync(deleteFournisseur))
  .put(isLoggedIn,isAcheteur, catchAsync(updateFournisseur));

module.exports = router;
