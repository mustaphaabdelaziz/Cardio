const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  creationform,
  listeMateriel,
  createMateriel,
  showMateriel,
  deleteMateriel,
  updateMateriel,
  generatepdf,
} = require("../../controller/materiel/materiel");
const { isLoggedIn, isAcheteur } = require("../../middleware/middleware");
router
  .route("/generatepdf")
  .get(isLoggedIn, isAcheteur, catchAsync(generatepdf));
router.route("/new").get(isLoggedIn, isAcheteur, catchAsync(creationform));
router
  .route("/")
  .get(isLoggedIn, isAcheteur, catchAsync(listeMateriel))
  .post(isLoggedIn, isAcheteur, catchAsync(createMateriel));
router
  .route("/:id")
  .get(isLoggedIn, isAcheteur, catchAsync(showMateriel))
  .put(isLoggedIn, isAcheteur, catchAsync(updateMateriel))
  .delete(isLoggedIn, isAcheteur, catchAsync(deleteMateriel));

module.exports = router;
