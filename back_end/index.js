import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.urlencoded({extended: true}));





var port = 3000;
app.listen(port||3000,function(){
   console.log("Running on Port " + port);
});