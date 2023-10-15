const User = require("../../model/user/user");
const Country = require("../../model/data/country");
const moment = require("moment");
const fonctions = require("../../seeds/fonction");
const privileges = require("../../seeds/privileges");
const passport = require("passport");
// ===========================================================================
module.exports.userList = async (req, res) => {
  const users = await User.find({});
  res.render("user/index", {
    users,
    fonctions: fonctions.fonction,
    privileges: privileges.privileges,
    moment,
  });
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
  res.render("user/login", { states, fonctions: fonctions.fonction });
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
      externe,
      privileges: ["user"],
    });
    console.log("9999");
    console.log(password);
    User.register(user, password, function (err, user) {
      if (err) {
        console.error(err);
        res.redirect("register");
      } else {
        console.log("55555");
        req.flash("success", "Contact the admin to ativate your account");
        res.redirect("/user/login");
      }
    });
    // req.flash("success", "Contact the admin to ativate your account");
    // res.redirect("/user/login");
    // res.send(req.body.user);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
// ============================ Login =================================
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome Back ${req.user.firstname}`);
  // update the recently logged in user
  await User.findByIdAndUpdate({ _id: req.user.id }, { loggedIn: moment() });
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
    newPassword,
    oldPassword,
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
  User.findOne({ _id: userid }).then((user, err) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: "User not found" }); // Return error, user was not found in db
      } else {
        user.setPassword(newPassword, function (err) {
          if (err) {
            if (err.name === "IncorrectPasswordError") {
              res.json({ success: false, message: "Incorrect password" }); // Return error
            } else {
              res.json({
                success: false,
                message:
                  "Something went wrong!! Please try again after sometimes.",
              });
            }
          } else {
            User.findByIdAndUpdate(
              { _id: userid },
              {
                firstname:
                  firstname.charAt(0).toUpperCase() +
                  firstname.slice(1).toLowerCase(),
                lastname:
                  lastname.charAt(0).toUpperCase() +
                  lastname.slice(1).toLowerCase(),
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
          }
        });
      }
    }
  });

  // res.send(req.body.user.privileges);
};
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.flash("success", "Utilisateur a été supprimé");
  res.redirect("/user");
};
module.exports.showProfile = async (req, res) => {
  // res.send("good")
  const user = await User.findById(req.params.id);
  res.render("user/profile", { user, moment, fonctions: fonctions.fonction });
};
