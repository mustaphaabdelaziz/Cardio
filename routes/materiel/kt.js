const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { listeKT, generatepdf } = require("../../controller/materiel/kt");
const { isLoggedIn } = require("../../middleware/middleware");isLoggedIn,
router.route("/generatepdf").get(isLoggedIn,catchAsync(generatepdf));

router.route("/").get(isLoggedIn,catchAsync(listeKT));
// router.route("/:idbc").get(catchAsync(showbc))

module.exports = router;
