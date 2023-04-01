const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  showcform,
  addArticle,
  showarticle,
  deleteMaterielArticle,
  updateMaterielArticle,
} = require("../../../controller/materiel/entrant/article");
const catchAsync = require("../../../utils/catchAsync");
const { isLoggedIn } = require("../../../middleware/middleware");
router.route("/").post(isLoggedIn,catchAsync(addArticle));
router.route("/new").get(isLoggedIn,catchAsync(showcform));
router
  .route("/:idarticle")
  .get(isLoggedIn,catchAsync(showarticle))
  .delete(isLoggedIn,catchAsync(deleteMaterielArticle))
  .put(isLoggedIn,catchAsync(updateMaterielArticle));

// patient/:idp/acte/:idacte

module.exports = router;
