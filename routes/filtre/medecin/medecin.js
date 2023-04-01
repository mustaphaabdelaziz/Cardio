const express = require("express");
const router = express.Router({ mergeParams: true });
const { listParMedecin } = require("../../../controller/filtre/medecin/medecin");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router.route("/").get(isLoggedIn, catchAsync(listParMedecin));
module.exports = router;
