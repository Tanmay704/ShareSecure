const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session= require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// database connection 

mongoose.promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/securesharedb",{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true });
const db = mongoose.connection;
mongoose.set('debug', true);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("connected");
});

// Middleware 
require('./config/passport')(passport);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
   // passport 
   app.use(session({ secret: 'SMRarote',
                     resave: false,
                     saveUninitialized: false
   })); // session secret
   app.use(passport.initialize());
   app.use(passport.session()); // persistent login sessions
   app.use(flash()); // use connect-flash for flash messages stored in session

// routes
  require('./routes/home.js')(app);
 //const adminlogin  =
  require('./routes/adminlogin.js')(app,passport);
 //const createroom  = require('./routes/createroom.js');
// const room  = require('./routes/room.js');
// const userlogin  = require('./routes/userlogin.js');
 //const roomsetting  = require('./routes/roomsetting.js');
 //const adminregister  = 
 require('./routes/adminregister.js')(app,passport);
 require('./routes/dashboard.js')(app,passport);


// using routes
//   app.use('/',home);
//   app.use('/adminlogin',adminlogin);
//   app.use('/room',room);
//   app.use('/createroom',createroom);
//   app.use('/userlogin',userlogin);
//   app.use('/roomsetting',roomsetting);
//   app.use('/adminregister',adminregister);
  
// listning local port 
var port = 3000;
app.listen(port||3000,function(){
   console.log("Running on Port " + port);
});