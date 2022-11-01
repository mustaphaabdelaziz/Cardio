const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { listeKT, generatepdf } = require("../controller/kt");
router.route("/generatepdf").get(catchAsync(generatepdf));

router.route("/").get(listeKT);
// router.route("/:idbc").get(catchAsync(showbc))

module.exports = router;
