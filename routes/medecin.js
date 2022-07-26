const express = require("express");
const router = express.Router({ mergeParams: true });
const {
listParMedecin
} = require("../controller/medecin");
const catchAsync = require("../utils/catchAsync");
router.route("/").get(catchAsync(listParMedecin));


module.exports = router;
