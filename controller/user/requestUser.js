const User = require("../../model/user/user");
const Country = require("../../model/data/country");
const moment = require("moment");

// ===========================================================================
module.exports.usersRequest = async (req, res) => {
  const user = await User.find({ approved: false });
  res.render("users/index", { user });
};

// ===============================================
module.exports.approveUser = async (req, res) => {
  const { id } = req.params;
  const { user } = req.body;

  let updatedUser = { ...user };
  if (user.approved == "on") {
    updatedUser.approved = true;
  } else {
    updatedUser.approved = false;
    updatedUser.privileges = ["user"];
  }
  await User.findByIdAndUpdate(id, { ...updatedUser }, { new: true });
  req.flash("success", "User modifié avec succes");
  res.redirect("/user");
};
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body.user;

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      privileges: ["user"],
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Cardio");
      res.redirect("/");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

// =============== Login ==============================
module.exports.login = (req, res) => {
  req.flash("success", `Welcome Back ${req.user.fullname}`);

  const redirectUrl = req.session.returnTo || "/patient";
  delete req.session.returnTo;

  res.redirect(redirectUrl);
};
// ======================= Logout ==============
module.exports.logout = (req, res) => {
  // logout requere a callback function and a get request to work
  req.logout(() => {
    req.flash("success", `Goodbye`);
    res.redirect("login");
  });
};
module.exports.updateUser = async (req, res) => {
  const { user, socialMedia } = req.body;
  //  const currentUser = req.user._id;
  const newUser = new User({ ...user });
  newUser.socialMedia = { ...socialMedia };

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      socialMedia: socialMedia,
      ...user,
    },
    { new: true }
  );
  res.redirect(`/user/${updatedUser._id}/profile`);
  // res.send(updatedUser);
};
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.logout();
  req.flash("success", "Goodbey");
  res.redirect("/events");
};
