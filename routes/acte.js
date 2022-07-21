var express = require("express")
var router = express.Router({ mergeParams: true })
const catchAsync = require("../utils/catchAsync");
var { showacteliste, filter } = require("../controller/acte")
router.route("/filter").get(catchAsync(filter));
router.route("/:id").get(showacteliste)

module.exports = router
