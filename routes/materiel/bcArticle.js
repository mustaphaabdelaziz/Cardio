/* this route is used to manupilate the articles in the BC */
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addArticleBC,
  updateArticleBc,
  deleteArticleBc,
} = require("../../controller/materiel/bcArticle");
const catchAsync = require("../../utils/catchAsync");
router.route("/").post(catchAsync(addArticleBC));
router
  .route("/:idart")
  .put(catchAsync(updateArticleBc))
  .delete(catchAsync(deleteArticleBc));

// patient/:idp/bc/:idbc

module.exports = router;
