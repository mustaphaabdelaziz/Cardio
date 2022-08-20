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
const { isLoggedIn } = require("../../middleware/middleware");
router.route("/generatepdf").get(isLoggedIn, catchAsync(generatepdf));
router.route("/new").get(isLoggedIn, catchAsync(creationform));
router
  .route("/")
  .get(isLoggedIn, catchAsync(listeMateriel))
  .post(isLoggedIn, catchAsync(createMateriel));
router
  .route("/:id")
  .get(isLoggedIn, catchAsync(showMateriel))
  .put(isLoggedIn, catchAsync(updateMateriel))
  .delete(isLoggedIn, catchAsync(deleteMateriel));

module.exports = router;
