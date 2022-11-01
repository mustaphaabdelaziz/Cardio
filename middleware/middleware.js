const { patientSchema } = require("../schemas");
const Staff = require("../model/staff");
const User = require("../model/user");
const conduiteMedicale = require("../seeds/conduiteMedicale");

const ExpressError = require("../utils/ExpressError");
// ALL MIDDLEWARE GOES HERE

module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/user/login");
  } else {
    req.session.medecinList = await Staff.find({ fonction: "Medecin" });
    req.session.conduiteMedicale = conduiteMedicale.conduitemedicale;
    req.session.newUsers = await User.find({ approved: false }).count();
  }
  // else if(!req.user.approved){
  //   req.flash("error", "Contact the admin to activate your account");
  //   return res.redirect("/user/login");
  // }
  next();
};
module.exports.isAdmin = async (req, res, next) => {
  if (req.user.privileges.includes("admin")) {
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/patient`);
  }
  next();
};
// module.exports.isAuthor = async (req, res, next) => {
//   const { id } = req.params;
//   const event = await Event.findById(id);
//   if (!event.author._id.equals(req.user._id)) {
//
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
