var express = require("express");
var router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
var { showliste
     
 } = require("../controller/conduiteMedicale");

var { isLoggedIn,isAssistant } = require("../middleware/middleware");

router.route("/:id").get(isLoggedIn,isAssistant, catchAsync(showliste));

module.exports = router;
