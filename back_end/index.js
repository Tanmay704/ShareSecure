import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// database connection 
mongoose.connect("mongodb://localhost:27017/securesharedb",{useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("connected");
});

// importing database Scheam
import { userSchema as userdb } from './database/user.js';
import { roomSchema as roomdb } from './database/room.js';
import { adminSchema as admindb } from './database/admin.js';
   // models of database

// testing Admin schema 
   
// routes
import { router as home } from './routes/home.js';
import { router as adminlogin } from './routes/adminlogin.js';
import { router as createroom } from './routes/createroom.js';
import { router as room } from './routes/room.js';
import { router as userlogin } from './routes/userlogin.js';
import { router as roomsetting } from './routes/roomsetting.js';
import { router as adminregister } from './routes/adminregister.js';


// using routes
  app.use('/',home);
  app.use('/adminlogin',adminlogin);
  app.use('/room',room);
  app.use('/createroom',createroom);
  app.use('/userlogin',userlogin);
  app.use('/roomsetting',roomsetting);
  app.use('/adminregister',adminregister);
  
// listning local port 
var port = 3000;
app.listen(port||3000,function(){
   console.log("Running on Port " + port);
});