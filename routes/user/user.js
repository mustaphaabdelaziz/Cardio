const express = require("express");
const passport = require("passport");
// const router = express.Router();
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");

const { isLoggedIn, isAdmin } = require("../../middleware/middleware");
const {
  login,
  userList,
  register,
  showUserForm,
  showLoginForm,
  logout,
  updateUser,
  deleteUser,
  showProfile,
  showResetPasswordForm,
  passwordReset,
  changePassword,
  showEmailSendingForm,
  sendEmail,
} = require("../../controller/user/user");
router.route("/").get(isLoggedIn, isAdmin, catchAsync(userList));
router.route("/register").post(catchAsync(register));
router
  .route("/login")
  .get(showLoginForm)
  .post(
    passport.authenticate("user", {
      failureFlash: true,
      failureRedirect: "/user/login",
      failureMessage: true,
    }),
    login
  );
router.route("/logout").get(isLoggedIn, logout);
router
  .route("/reset-password/")
  .get(catchAsync(showEmailSendingForm))
  .post(catchAsync(sendEmail));
router
  .route("/:userid")
  .get(isLoggedIn, catchAsync(showUserForm))
  .put(isLoggedIn, isAdmin, catchAsync(updateUser))
  .delete(isLoggedIn, isAdmin, catchAsync(deleteUser));
router.route("/:userid/reset-password/").put(catchAsync(changePassword));
router
  .route("/reset-password/:token")
  .get(catchAsync(showResetPasswordForm))
  .post(catchAsync(passwordReset));
router.route("/:userid/profile").get(catchAsync(showProfile));

module.exports = router;
