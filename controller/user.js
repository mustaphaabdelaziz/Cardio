const User = require("../model/user");
const Country = require("../model/country");
const moment = require("moment");

// ===========================================================================
module.exports.userList = async (req, res) => {
  const users = await User.find({});
  res.render("user/index", { users });
};

// ===============================================
module.exports.showUserForm = async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(user)
  res.render("user/editProfile", { user });
};

// ===============================================
module.exports.showLoginForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("user/login", { states });
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
    req.flash("success", "Contact the admin to ativate your account");
    res.redirect("/user/login");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
// =============== Login ==============================
module.exports.login = (req, res) => {
  req.flash("success", `Welcome Back ${req.user.username}`);
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
  const { username, email, approved } = req.body.user;
  const { id } = req.params;
  //  const currentUser = req.user._id;

  await User.findByIdAndUpdate(
    { _id: id },
    {
      username,
      email,
      approved: approved === "on" ? true : false,
    },
    { new: true }
  );
  res.redirect(`/user`);
  // res.send(req.body.user);
};
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.logout();
  req.flash("success", "Goodbey");
  res.redirect("/events");
};
