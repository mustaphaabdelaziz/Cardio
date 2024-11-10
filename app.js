if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
// The <<path>> module provides utilities for working with file and directory paths
const path = require("path");
let ejs = require("ejs");
// <<ejs-mate>> is layout, partial and block template functions for the EJS template engine.
const ejsMate = require("ejs-mate");
// <<method-override>> Lets you use HTTP verbs such as PUT or DELETE in places
// where the client doesn't support it.
const methodOverride = require("method-override");
const session = require("express-session");
// flash is a middleware that can be used to flash messages to the user.
const flash = require("connect-flash");
/*  Passport is the authentication library .
Passport is Express-compatible authentication middleware for Node.js */
const passport = require("passport");
// Passport uses the concept of strategies to authenticate requests
// passport-local is an authentication strategy.
const LocalStrategy = require("passport-local");
// <<connect-mongo>> MongoDB session store for Connect and Express written in Typescript.
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const DBConnection = require("./database/connection");
const { sessionConfig } = require("./config/sessionConfig");
// the local file contain all the local variable
const { locals } = require("./config/local");
const materielRoutes = require("./routes/materiel/entrant/materiel");
const patientKTRoutes = require("./routes/materiel/sortant/kt");
const bcktRoutes = require("./routes/materiel/sortant/bc");
const bcArticleRoutes = require("./routes/materiel/sortant/bcArticle");
const articleRoutes = require("./routes/materiel/entrant/article");
const fournisseurRoutes = require("./routes/materiel/fournisseur/fournisseur");
const detailsArticleRoutes = require("./routes/materiel/entrant/detailsArticle");
const patientRoutes = require("./routes/patient/patient");
const filsRoutes = require("./routes/patient/fils");
const staffRoutes = require("./routes/staff/staff");
const medicamentRoutes = require("./routes/medicament/medicament");
const consultationRoutes = require("./routes/patient/consultation/consultation");
const detailConsultaFtionRoutes = require("./routes/patient/consultation/detailConsultation");
const compteRenduRoutes = require("./routes/patient/consultation/compteRendu/compteRendu");
const medecinRoutes = require("./routes/filtre/medecin/medecin");
const userRoutes = require("./routes/user/user");
const requestUserRoutes = require("./routes/user/requestUser");
const acteRoutes = require("./routes/filtre/acte/acte");
const conduiteMedicaleRoutes = require("./routes/filtre/conduiteMedical/conduiteMedicale");
const ExpressError = require("./utils/ExpressError");
const { errorPage } = require("./middleware/middleware");
const User = require("./model/user/user");
const Report = require("./model/patient/compteRendu");
const Medicament = require("./model/medicament/medicament");
// const compression = require("compression");
const { isLoggedIn } = require("./middleware/middleware");
const _ = require("lodash");
const Patient = require("./model/patient/patient");
// const helmet = require("helmet");
// ==================== App Configuration =================
// app.set("trust proxy", true);
// app.disable("x-powered-by");
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://code.jquery.com/",
//         "https://cdn.jsdelivr.net",
//         "https://ajax.googleapis.com",
//         "https://unpkg.com",
//         "https://cdnjs.cloudflare.com",
//       ],
//       scriptSrcElem: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://code.jquery.com/",
//         "https://cdn.jsdelivr.net",
//         "https://ajax.googleapis.com",
//         "https://unpkg.com",
//         "https://cdnjs.cloudflare.com",
//       ],
//       styleSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://cdn.jsdelivr.net",
//         "https://fonts.googleapis.com",
//         "https://unpkg.com",
//         "https://getbootstrap.com",
//         "https://cdnjs.cloudflare.com",
//       ],
//       imgSrc: [
//         "'self'",
//         "data:",
//         "https://ui-avatars.com",
//         "https://res.cloudinary.com",
//         "https://picsum.photos",
//         "https://fastly.picsum.photos",
//       ],
//       scriptSrcAttr: ["'self'", "'unsafe-inline'"],
//       connectSrc: ["'self'"],
//       // Add other directives as needed
//     },
//   })
// );
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(mongoSanitize({ replaceWith: "_" }));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  "user",
  new LocalStrategy(async (email, password, done) => {
    await User.findOne({ email: email.toLowerCase() })
      .select("+salt +hash")
      .then((user, err) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, "Verifer email ou le mot de passe");
        } else {
          if (user.verifyPassword(password, user.hash)) {
            if (user.approved) {
              return done(null, user);
            } else {
              return done(
                null,
                false,
                "Votre compte n'est pas encore approuvé"
              );
            }
          } else {
            return done(
              null,
              false,
              "Mot de passe incorrect, verifier votre mot de passe"
            );
          }
        }
      });
  })
);

// serialization refers to how to store user's
// authentication user data will be stored in the session
passport.serializeUser((user, done) => {
  passport.serializeUser(User.serializeUser());
  done(null, user);
});

// deserialization refers to how remove user's authentication data
passport.deserializeUser((user, done) => {
  passport.deserializeUser(User.deserializeUser());
  done(null, user);
});
app.use(locals);

// app.use(compression());
// =========================================================

// ================= App Routes =======================
// need to be logged in
app.use("/acte", acteRoutes);
// need to be logged in
app.use("/conduitemedicale", conduiteMedicaleRoutes);
// need to be logged in and has to be an Achetteur
app.use("/fournisseur", fournisseurRoutes);
// need to be logged in and has to be an Achetteur
app.use("/materiels", materielRoutes);
// need to be logged in and has to be an Achetteur or technicien or medecin
app.use("/kt", patientKTRoutes);
// need to be logged in and has not to be an Achetteur
app.use("/patient", patientRoutes);
// need to be logged in and has not to be an admin
app.use("/staffs", staffRoutes);
// need to be logged in and has to be an Medecin
app.use("/medicaments", medicamentRoutes);
// need to be logged in and has to be an admin
app.use("/user", userRoutes);
// need to be logged in and has to be an admin
app.use("/user/request", requestUserRoutes);
// need to be logged in and has to be an acheteur or technicien or medecin
app.use("/kt/bc/:id", bcktRoutes);
// need to be logged in and has to be an acheteur or technicien or medecin
app.use("/kt/bc/:id/:idbc/articles", bcArticleRoutes);
// need to be logged in and has to be an acheteur
app.use("/materiel/:id/article", articleRoutes);
// need to be logged in and has to be an acheteur
app.use("/materiel/:id/articles/:idarticle", detailsArticleRoutes);
// need to be logged in and not an acheteur
app.use("/medecin/:lastname", medecinRoutes);
// need to be logged in and has to be a medecin
app.use("/patient/:id/acte/:idacte/compterendu", compteRenduRoutes);
// need to be logged in and has to be an assistant , technicien or medecin
app.use("/patient/:id/acte/:idacte", detailConsultaFtionRoutes);
app.use("/patient/:id/acte", consultationRoutes);
app.use("/patient/:id/son", filsRoutes);
// ========================================================

// Usage
app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});
app.get("/reports", async (req, res) => {
  // await User.updateMany(
  //   {},
  //   {
  //     $set: {
  //       firstname: "",
  //       lastname: "",
  //       phone: "",
  //       fonction: "",
  //       externe: "",
  //     },
  //   },
  //   { strict: false }
  // );
  // await Report.deleteMany({
  //   $or: [{ type: " " }, { type: "" }, { type: "  " }],
  // });
  // await Medicament.deleteMany({
  //   $or: [{ dci: " " }, { dci: null }, { dci: "  " }],
  // });
  // await Patient.updateMany(
  //   {
  //     consultation: {
  //       $exists: true,
  //     },
  //   },

  //   [
  //     {
  //       $set: {
  //         "consultation.poids": "$poids",
  //         "consultation.saturation": "$saturation",
  //         "consultation.taille": "$taille",
  //       },
  //     },
  //     {
  //       $unset: "saturation",
  //     },
  //     {
  //       $unset: "poids",
  //     },
  //     {
  //       $unset: "taille",
  //     },
  //   ],

  //   {
  //     multi: true,
  //   }
  // );
  let p = await Patient.find({
    "consultation.compterendu.isEmpty": true,
    activated: true,
  });
  res.send(p);
});
// app.all("*", (req, res, next) => {
//   next(new ExpressError("page not found", 404));
// });
// app.use(errorPage);
const port = process.env.PORT;

app.listen(port,'0.0.0.0', () => {
  console.log("===================================================");
  console.log(`   ----- SERVER IS RUNNING ON PORT ${port} ----`);
  console.log("===================================================");
});
