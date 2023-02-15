const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  creationform,
  listeMateriel,
  createMateriel,
  showMateriel,
  deleteMateriel,
  updateMateriel,
  generatepdf,
} = require("../controller/materiel");
router.route("/generatepdf").get(catchAsync(generatepdf));
router.route("/new").get(isMedecin, creationform);
router.route("/").get(isMedecin, listeMateriel).post(isMedecin, createMateriel);
router
  .route("/:id")
  .get(isMedecin, showMateriel)
  .put(isMedecin, catchAsync(updateMateriel))
  .delete(isMedecin, catchAsync(deleteMateriel));

module.exports = router;
