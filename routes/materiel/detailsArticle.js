const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addDetail,
  showdetail,
  updatedetail,
  deletedetail
} = require("../../controller/materiel/detailsArticle");
const catchAsync = require("../../utils/catchAsync");
router.route("/").get(catchAsync(showdetail)).post(catchAsync(addDetail));
router
.route("/:iddetail")
.delete(deletedetail)
.put(updatedetail);
// patient/:idp/acte/:idacte

module.exports = router;
