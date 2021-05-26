"use strict";
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const saltRounds = process.env.SALT;

module.exports = function (router) {
  const JWT_SECRET = process.env.JWT_SECRET;
  var User = require("../database/admin");

  router.get("/resetpassword/:username/:token", (req, res, next) => {
      const { username, token } = req.params;

    //check if this id exist in database
    User.findOne({ "local.username": username }, function (err, user) {
      // if there are any errors, return the error
       if (err) {
         return done(err);
       }

      // check to see if theres already a user with that email
       if (!user) {
         console.log("that username do not exists");
         res.render("forgotpassword.ejs",{ message: 'email not matched'});
         return;
       }

      const secret = JWT_SECRET + user.local.password;

      //we have a valid email and have a valid user with this id

      try {
         const payload = jwt.verify(token, secret);
         res.render("resetpassword", { email: user.local.email });
      } catch (error) {
         console.log(error.message);
         res.send(error.message);
      }
    });
  });

  router.post("/resetpassword/:username/:token", (req, res, next) => {
     const { username, token } = req.params;

     const { password, password2 } = req.body;

    //check if this id exist in database
    User.findOne({ "local.username": username }, function (err, user) {
      // if there are any errors, return the error
        if (err) {
          return done(err);
        }

      // check to see if theres already a user with that email
        if (!user) {
          console.log("that username do not exists");
          res.render("forgotpassword.ejs",{ message: 'user not exist'});
          return;
        }

      const secret = JWT_SECRET + user.local.password;
      console.log(user.local.password);

      //we have a valid email and have a valid user with this id

      try {
         const payload = jwt.verify(token, secret);
        //validate password and password2 should match
        if (password != password2) {

           res.send("password does not match!!!");
           return;
        }

        //we can simply find the user with the payload email and id and finally update with new password
        //always hash the password before saving
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        //const filter = { username: user.local.username };
        console.log(hash);
        // Document changed in MongoDB, but not in Mongoose
        // User.updateOne(filter, { password: hash });
        console.log(user.local.email);

        User.findOneAndUpdate(
           { "local.email": user.local.email },
           { $set: { "local.password": hash } },
           { new: true },
            (err, doc) => {
              if (err) {
                console.log("Something wrong when updating data!");
              }
                res.render("adminlogin.ejs",{ message: 'Reset password sucessful...'});
                return;
            }
        );
      } catch (error) {
        console.log(error.message);
        res.send(error.message);
      }
    });
  });
};
