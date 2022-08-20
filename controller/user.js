const User = require("../model/user");
const Country = require("../model/country");
const moment = require("moment");

// ===========================================================================
module.exports.showUserForm = async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(user)
  res.render("users/editProfile", { user });
};

// ===============================================
module.exports.showLoginForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("user/login", { states });
};
module.exports.register = async (req, res) => {
  //  ES1

  try {
    const { username, email, password } = req.body.user;

    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Investi");
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

  // console.log(res.locals);
  const redirectUrl = req.session.returnTo || "/patient";
  delete req.session.returnTo;

  // console.log("is Authenticated: ", req.isAuthenticated());
  // console.log(res.locals.currentUser);
  // console.log(res.locals.user);
  // console.log(req.user);
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
module.exports.follow = async (req, res) => {
  // get the currentUser
  const { userId } = req.body;
  // get the following userid
  const { follwedUserId } = req.body;
  let fUser, cUser, nbrFollowers;
  if (req.body.follow) {
    // add the followed user to the following list of the currentUser
    cUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { followings: follwedUserId } },
      { new: true }
    );
    // add the currentUser to the followers list of the followed user
    fUser = await User.findByIdAndUpdate(
      follwedUserId,
      { $addToSet: { followers: userId } },
      { new: true }
    );
    nbrFollowers = fUser.followers.length;
  } else {
    // if he unfollows him
    // remove him from the following list
    cUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { followings: { $in: [follwedUserId] } } },
      { new: true }
    );

    fUser = await User.findByIdAndUpdate(
      follwedUserId,
      { $pull: { followers: { $in: [userId] } } },
      { new: true }
    );
    nbrFollowers = fUser.followers.length;
  }
  res.send({
    status: true,
    message: "followed",
    nbrFollowers,
  });
};
