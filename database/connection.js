const mongoose = require("mongoose");
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
db.once("open", () => {
 console.log("Database connected");
});

