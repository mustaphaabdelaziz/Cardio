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
router.route("/new").get(creationform);
router.route("/").get(listeMateriel).post(createMateriel);
 router
   .route("/:id")
   .get(showMateriel)
   .put(catchAsync(updateMateriel))
    .delete(catchAsync(deleteMateriel));

module.exports = router;
