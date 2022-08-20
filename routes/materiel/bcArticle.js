/* this route is used to manupilate the articles in the BC */
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showBc,
  addArticleBC,
  updateArticleBc,
  deleteArticleBc,
} = require("../../controller/materiel/bcArticle");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middleware/middleware");
router.route("/").get(isLoggedIn,catchAsync(showBc)).post(isLoggedIn,catchAsync(addArticleBC));
router
  .route("/:idart")
  .put(isLoggedIn,catchAsync(updateArticleBc))
  .delete(isLoggedIn,catchAsync(deleteArticleBc));

// patient/:idp/bc/:idbc

module.exports = router;
