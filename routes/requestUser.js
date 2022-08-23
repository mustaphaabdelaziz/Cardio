const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn } = require("../middleware/middleware");
const { usersRequest } = require("../controller/requestUser");
router.route("/").get(usersRequest);
module.exports = router;
