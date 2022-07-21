// const Event = require("../models/event/event");
// const Product = require("../models/company/product");
// const Discussion = require("../models/event/discussion");
// const Coment = require("../models/event/coment");

const ExpressError = require("../utils/ExpressError");
// ALL MIDDLEWARE GOES HERE

// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     req.session.returnTo = req.originalUrl;
//     req.flash("error", "You must be signed in first!");
//     return res.redirect("/user/login");
//   }
//   next();
// };
// module.exports.isAuthor = async (req, res, next) => {
//   const { id } = req.params;
//   const event = await Event.findById(id);
//   if (!event.author._id.equals(req.user._id)) {
//     // console.log("is the same user");
//     req.flash("error", "You do not have permission to do that!");
//     return res.redirect(`/events/${id}`);
//   }
//   next();
// };
// module.exports.isComentAuthor = async (req, res, next) => {
//   const { id, comentId } = req.params;
//   const coment = await Coment.findById(comentId);
//   if (!coment.author.equals(req.user._id)) {
//     req.flash("error", "You do not have permission to do that!");
//     return res.redirect(`/events/${id}`);
//   }
//   next();
// };

module.exports.errorPage = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (statusCode === 404 && !err.message) err.message = "Page Not Found";
  else if (statusCode === 403 && !err.message) err.message = "Forbiden";
  else if (statusCode === 500 && !err.message)
    err.message = "Internal Server Error";
  else if (!err.message) err.message = "Somthing Went Wrong";
  res.status(statusCode).render("errorHandling/error2", {
    err,
    statusCode,
  });
};
