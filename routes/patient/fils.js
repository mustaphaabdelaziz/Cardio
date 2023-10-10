const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  createSon,
  showSon,
  deleteSon,
  updateSon,
} = require("../../controller/patient/fils");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn,isAssistant } = require("../../middleware/middleware");
router.route("/").post(isLoggedIn, isAssistant, catchAsync(createSon));
router
  .route("/:idSon")
  .get(isLoggedIn, catchAsync(showSon))
  .delete(isLoggedIn, isAssistant, catchAsync(deleteSon))
  .put(isLoggedIn, isAssistant, catchAsync(updateSon));

module.exports = router;
