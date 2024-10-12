const User = require("../../model/user/user");
const Country = require("../../model/data/country");
const moment = require("moment");
const fonctions = require("../../seeds/fonction");
const privileges = require("../../seeds/privileges");
const { sendMail } = require("../../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
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
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      req.flash("error", "user already exist");
      res.redirect("register");
    } else {
      const user = new User({
        firstname:
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
        lastname:
          lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
        fonction,
        phone: phone1,
        email: email1.toLowerCase(),
        hash: password,
        externe,
        privileges: ["user"],
      });
      
      await user.save().then((usr, err) => {
        if (err) {
    
          req.flash("error", err);
          res.redirect("register");
        } else {
          req.flash("success", "Contacter l'admin pour activer votre compte");
          res.redirect("/user");
        }
      });
    }
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
// ============================ Login =================================
module.exports.login = async (req, res) => {
  req.flash("success", `Welcome Back ${req.user.firstname}`);
  // update the recently logged in user
  await User.findByIdAndUpdate(req.user.id, { loggedIn: moment() });
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
module.exports.showResetPasswordForm = async (req, res) => {
  const { token } = req.params;
  // Verify the token, update the user's password, and redirect
  await User.findOne({ "resetToken.token": token }).then(async (user) => {
    if (!user) {
      req.flash("error", "الرابط غير صالح");
      res.redirect("/user/login");
    } else {
      // check if the token has expired
      if (moment().isBefore(user.resetToken.expires)) {
        res.render("user/resetPassword", { email: user.email, token });
      } else {
        req.flash("error", "الرابط غير صالح");
        res.redirect("/user/login");
      }
    }
  });
};
module.exports.passwordReset = async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(password, salt);
  try {
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          hash: hash,
          salt: salt,
          resetToken: {},
        },
      }
    );
    req.flash("success", "تم تغيير كلمة المرور بنجاح");
    res.redirect("/user/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("back");
  }
};
module.exports.changePassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(newPassword, salt);
  const user = await User.findById({ _id: req.user.id }).select("+salt +hash");
  try {
    if (user.verifyPassword(oldPassword, user.hash)) {
      await User.findByIdAndUpdate(
        { _id: req.user.id },
        { hash: hash, salt: salt }
      );
      req.flash("success", "Le mot de passe a été changé avec succès");
      res.redirect("/user/" + req.user.id + "/profile");
    }
  } catch (e) {
    console.error(e);
    req.flash("error", "Le mot de passe n'est pas correct");
    res.redirect("/user/" + req.user.id + "/profile");
  }
};
function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.flash("success", "Utilisateur a été supprimé");
  res.redirect("/user");
};
module.exports.showProfile = async (req, res) => {
  // res.send("good")
  const user = await User.findById(req.params.userid);
  res.render("user/profile", { user, moment, fonctions: fonctions.fonction });
};
module.exports.showEmailSendingForm = async (req, res) => {
  res.render("user/sendEmailReset");
};
module.exports.sendEmail = async (req, res) => {
  const { email } = req.body;
  // generate a reset token for the user, save it to the database
  try {
    const createdAt = moment();
    const expires = createdAt.add(1, "days");
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        resetToken: {
          token: generateResetToken(),
          createdAt: createdAt,
          expires: expires,
        },
      },
      { new: true }
    );
    if (!user) {
      req.flash("error", "ليس هنالك حساب بهذا الإيمل");
      res.redirect("back");
    } else {
      sendMail(email, user.resetToken.token);
      req.flash("success", "تم ارسال  رابط تغيير كلمة المرور عبر الإيمل");
      res.redirect("/user/login");
    }
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};
