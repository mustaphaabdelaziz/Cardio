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
    const { firstname, lastname, fonction, externe, phone, email, password } =
      req.body.user;
    let phone1 = phone.trim();
    let email1 = email.trim();
    if (phone1 === "") {
      phone1 = "/";
    }
    if (email1 === "") {
      email1 = "/";
    }
    const user = new User({
      firstname:
        firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
      lastname:
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
      fonction,
      phone: phone1,
      email: email1.toLowerCase(),
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
  console.log(req.user)
  req.flash("success", `Welcome Back ${req.user.firstname}`);

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
  const {
    firstname,
    lastname,
    fonction,
    phone,
    email,
    externe,
    approved,
    privileges,
  } = req.body.user;

  const { userid } = req.params;

  const type = externe;
  let phone1 = phone.trim();
  let email1 = email.trim();
  if (phone1 === "") {
    phone1 = "/";
  }
  if (email1 === "") {
    email1 = "/";
  }
  await User.findByIdAndUpdate(
    { _id: userid },
    {
      firstname:
        firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
      lastname:
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
      fonction,
      phone: phone1,
      email: email1.toLowerCase(),
      externe: type === "externe" ? externe : "interne",
      approved: approved === "on" ? true : false,
      privileges,
    },
    { new: true }
  );

  res.redirect(`/user`);
  // res.send(req.body.user);
};
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.flash("success", "Utilisateur a été supprimé");
  res.redirect("/user");
};
