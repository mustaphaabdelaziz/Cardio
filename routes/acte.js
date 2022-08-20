var express = require("express");
var router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
var { showacteliste, filter } = require("../controller/acte");
var { isLoggedIn } = require("../middleware/middleware");
router.route("/filter").get(isLoggedIn, catchAsync(filter));
router.route("/:id").get(isLoggedIn, catchAsync(showacteliste));

module.exports = router;
