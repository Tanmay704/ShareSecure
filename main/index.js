require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));

// database connection
mongoose.promise = global.Promise;
const dburl = process.env.DBURL;
mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
mongoose.set("debug", true);
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected");
});

// Middleware
require("./config/passport")(passport);
//use css file
app.use(express.static(__dirname + '/public'));


app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


app.use(
  session({ secret: process.env.Session , resave: false, saveUninitialized: false })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes
require("./routes/home.js")(app);
require("./routes/adminlogin.js")(app, passport);
require("./routes/createroom.js")(app, passport);
require("./routes/adminregister.js")(app, passport);
require("./routes/dashboard.js")(app, passport);
require("./routes/userlogin.js")(app);
require("./routes/forgotpassword.js")(app);
require("./routes/resetpassword.js")(app);

// listning local port
var port = process.env.PORT;
app.listen(port, function () {
  console.log("Running on Port " + port);
});
