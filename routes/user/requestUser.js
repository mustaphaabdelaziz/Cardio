const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");

const { isLoggedIn } = require("../../middleware/middleware");
const {
  usersRequest,
  approveUser,
} = require("../../controller/user/requestUser");
router.route("/").get(usersRequest);
router.route("/approve/:id").put(isLoggedIn, catchAsync(approveUser));
module.exports = router;
