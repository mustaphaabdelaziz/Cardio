const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const { isLoggedIn } = require("../middleware/middleware");
const {
  login,
  register,
  showUserForm,
  showLoginForm,
  logout,
  updateUser,
  deleteUser,
} = require("../controller/user");
router.route("/register").post(catchAsync(register));
router
  .route("/login")
  .get(showLoginForm)
  .post(
    passport.authenticate("user", {
      failureFlash: true,
      failureRedirect: "/user/login",
    }),
    login
  );
router.route("/logout").get(logout);
router
  .route("/:id")
  .get(isLoggedIn,catchAsync(showUserForm))
  .put(isLoggedIn,catchAsync(updateUser))
  .delete(isLoggedIn,catchAsync(deleteUser));
module.exports = router;
