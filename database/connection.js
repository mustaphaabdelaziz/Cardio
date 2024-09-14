const mongoose = require("mongoose");
const User = require("../model/user/user");
// ============ database connection ====================
// const dbUrl ="mongodb+srv://aziz:dancemonkey@cluster0.koaje.mongodb.net/eventplus?retryWrites=true&w=majority";
// const dbUrl = process.env.DB_URL || process.env.LOCAL_DB_URL;
const dbUrl = process.env.LOCAL_DB_URL;
mongoose.connect(dbUrl, {
  // useNewUrlParser: true,
  // useCreateIndex: true,        //those options are no longer supported in Mongoose 6
  // useUnifiedTopology: true,    // so check ur version first if it's <6 add them
  // useFindAndModify: false,
});
// We now need to get notified if we connect successfully
//  or if a connection error occurs:
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  const userExist = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (userExist) {
    console.log("user already exist");
    console.log("Database connected");
  } else {
    const user = new User({
      firstname: process.env.ADMIN_FIRSTNAME,
      lastname: process.env.ADMIN_LASTNAME,
      email: process.env.ADMIN_EMAIL,
      hash: process.env.ADMIN_PASSWORD,
      approved: true,
    });
    //  user.replaceOne.push("أدمين");
    user.privileges.push("admin", "superadmin");
    await user.save().then((usr, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Database connected");
        console.log("user created");
      }
    });
  }
});
