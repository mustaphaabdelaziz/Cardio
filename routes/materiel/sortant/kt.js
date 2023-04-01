const express = require("express");
const router = express.Router();
const catchAsync = require("../../../utils/catchAsync");
const { listeKT, generatepdf } = require("../../../controller/materiel/sortant/kt");
const {
  isLoggedIn,
  isTech,
  isAcheteur,
} = require("../../../middleware/middleware");
isLoggedIn,
  router
    .route("/generatepdf")
    .get(isLoggedIn, isTech, isAcheteur, catchAsync(generatepdf));

router.route("/").get(isLoggedIn, isTech, isAcheteur, catchAsync(listeKT));
// router.route("/:idbc").get(catchAsync(showbc))

module.exports = router;
