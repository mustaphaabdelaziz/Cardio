const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showcform,
  addArticle,
  showarticle,
  deleteMaterielArticle,
  updateMaterielArticle,
} = require("../controller/article");
const catchAsync = require("../utils/catchAsync");
router.route("/").post(catchAsync(addArticle));
router.route("/new").get(catchAsync(showcform));
router
  .route("/:idarticle")
  .get(catchAsync(showarticle))
  .delete(catchAsync(deleteMaterielArticle))
  .put(catchAsync(updateMaterielArticle));

// patient/:idp/acte/:idacte

module.exports = router;
