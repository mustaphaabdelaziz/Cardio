var express = require("express");
var router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
var { showacteliste, filter } = require("../controller/acte");
var { isLoggedIn,isAssistant } = require("../middleware/middleware");
router.route("/filter").get(isLoggedIn,isAssistant, catchAsync(filter));
router.route("/:id").get(isLoggedIn,isAssistant, catchAsync(showacteliste));

module.exports = router;
