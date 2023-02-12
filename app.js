if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
let ejs = require("ejs");
const ejsMate = require("ejs-mate");
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
const MongoDBStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
// Connect/Express middleware that can be used to enable CORS
const cors = require("cors");
const DBConnection = require("./database/connection");
const { sessionConfig } = require("./config/sessionConfig");
// the local file contain all the local variable
const { locals } = require("./config/local");
const materielRoutes = require("./routes/materiel/materiel");
const patientKTRoutes = require("./routes/materiel/kt");
const bcktRoutes = require("./routes/materiel/bc");
const bcArticleRoutes = require("./routes/materiel/bcArticle");
const articleRoutes = require("./routes/materiel/article");
const fournisseurRoutes = require("./routes/materiel/fournisseur");
const detailsArticleRoutes = require("./routes/materiel/detailsArticle");
const patientRoutes = require("./routes/patient");
const staffRoutes = require("./routes/staff");
const medicamentRoutes = require("./routes/medicament");
const consultationRoutes = require("./routes/consultation");
const compteRenduRoutes = require("./routes/compteRendu");
const medecinRoutes = require("./routes/medecin");
const userRoutes = require("./routes/user");
const requestUserRoutes = require("./routes/requestUser");
const acteRoutes = require("./routes/acte");
const conduiteMedicaleRoutes = require("./routes/conduiteMedicale");
const ExpressError = require("./utils/ExpressError");
const { errorPage } = require("./middleware/middleware");
const User = require("./model/user");
const Report = require("./model/compteRendu");
const compression = require("compression");
const { isLoggedIn } = require("./middleware/middleware");
// ==================== App Configuration =================
app.set("trust proxy", true);
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
// flash is not working
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use("user", new LocalStrategy(User.authenticate()));
passport.use(
  "user",
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username.toLowerCase() }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      } else {
        if (user.approved) {
          return done(null, user);
        } else {
          return done(null, false, "Your account is not approved yet");
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
app.use(cors());
app.use(compression());
// =========================================================

// ================= App Routes =======================
app.use("/acte", acteRoutes);
app.use("/conduitemedicale", conduiteMedicaleRoutes);
app.use("/fournisseur", fournisseurRoutes);
app.use("/materiels", materielRoutes);
app.use("/kt", patientKTRoutes);
app.use("/patient", patientRoutes);
app.use("/staffs", staffRoutes);
app.use("/medicaments", medicamentRoutes);
app.use("/user", userRoutes);
app.use("/user/request", requestUserRoutes);
app.use("/kt/bc/:id", bcktRoutes);
app.use("/kt/bc/:id/:idbc/articles", bcArticleRoutes);
app.use("/materiel/:id/article", articleRoutes);
app.use("/materiel/:id/articles/:idarticle", detailsArticleRoutes);
app.use("/medecin/:lastname", medecinRoutes);
app.use("/patient/:id/acte/:idacte/compterendu", compteRenduRoutes);
app.use("/patient/:id/acte", consultationRoutes);
// ========================================================
app.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});
// app.get("/reports", async (req, res) => {
//   await Report.deleteMany({$or:[{type:" "},{type:""},{type:"  "}]})
//   res.send("Mabrouk")
// });
// app.all("*", (req, res, next) => {
//   next(new ExpressError("page not found", 404));
// });
// app.use(errorPage);
const port = 8000;

app.listen(port, () => {
  console.log("===================================================");
  console.log(`   ----- SERVER IS RUNNING ON PORT ${port} ----`);
  console.log("===================================================");
});
