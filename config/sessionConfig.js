const dbUrl = process.env.LOCAL_DB_URL;
// const dbUrl = process.env.LOCAL_DB_URL;
const secret = process.env.SECRET || "thisshouldbeabettersecret!";
const MongoDBStore = require("connect-mongo");
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});
module.exports.sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true, when set to true current User doesn't work
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
    },
};