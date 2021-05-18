import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// database connection 
mongoose.connect("mongodb://localhost:27017/securesharedb",{useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("connected");
});


// routes
import { router as home } from './routes/home.js';
import { router as adminlogin } from './routes/adminlogin.js';
import { router as createroom } from './routes/createroom.js';
import { router as room } from './routes/room.js';
import { router as userlogin } from './routes/userlogin.js';
import { router as roomsetting } from './routes/roomsetting.js';

// using routes
  app.use('/',home);
  app.use('/adminlogin',adminlogin);
  app.use('/room',room);
  app.use('/createroom',createroom);
  app.use('/userlogin',userlogin);
  app.use('/roomsetting',roomsetting);
  
// listning local port 
var port = 3000;
app.listen(port||3000,function(){
   console.log("Running on Port " + port);
});