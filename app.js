if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
let ejs = require("ejs");
let pdf = require("html-pdf");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
// flash is a middleware that can be used to flash messages to the user.
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
// Connect/Express middleware that can be used to enable CORS
const cors = require("cors");
const DBConnection = require("./database/connection");
const { sessionConfig } = require("./config/sessionConfig");
// the local file contain all the local variable
const { locals } = require("./config/local");
const materielRoutes = require("./routes/materiel");
const patientKTRoutes = require("./routes/kt");
const bcktRoutes = require("./routes/bc");
const articleRoutes = require("./routes/article");
const patientRoutes = require("./routes/patient");
const staffRoutes = require("./routes/staff");
const consultationRoutes = require("./routes/consultation");
const medecinRoutes = require("./routes/medecin");
const acteRoutes = require("./routes/acte");
// const Patient = require("./model/patient")
const ExpressError = require("./utils/ExpressError");
const { errorPage } = require("./middleware/middleware");
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
app.use(locals);
app.use(cors());
// =========================================================

// ================= App Routes =======================
app.use("/acte", acteRoutes);
app.use("/materiels", materielRoutes);
app.use("/kt", patientKTRoutes);
app.use("/patient", patientRoutes);
app.use("/staffs", staffRoutes);
app.use("/kt/bc/:id/", bcktRoutes);
app.use("/materiel/:id/article", articleRoutes);
app.use("/medecin/:lastname", medecinRoutes);
app.use("/patient/:id/acte", consultationRoutes);
// ========================================================
app.get("/", (req, res) => {
  res.render("home");
});
app.all("*", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});
app.use(errorPage);
const port = 8000;

app.listen(port, () => {
  console.log("===================================================");
  console.log(`   ----- SERVER IS RUNNING ON PORT ${port} ----`);
  console.log("===================================================");
});
