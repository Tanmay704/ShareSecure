"use strict";

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports = function (router) {
  const JWT_SECRET = "some super secret...";
  var User = require("../database/admin");

  // Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sharesecure0@gmail.com",
      pass: "secureshare@123",
    },
  });

  // Step 2

  // Step 3

  router.get("/forgotpassword", function (req, res, next) {
    res.render("forgotpassword.ejs",{message:''});
  });

  router.post("/forgotpassword", function (req, res, next) {
    const { email } = req.body;
    //make sure user exists in database
    User.findOne({ "local.email": email }, function (err, user) {
      // if there are any errors, return the error
      if (err) {
        return done(err);
      }

      // check to see if theres already a user with that email
      if (!user) {
        console.log("that email do not exists");
        res.render("forgotpassword.ejs",{message:email + ' does not exists'});
        return ;
      }

      //user exist and now create a ont time link for 15 mins
      const secret = JWT_SECRET + user.local.password;
      const payload = {
        email: user.local.email,
        username: user.local.username,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });

      const link = `http://localhost:3000/resetpassword/${user.local.username}/${token}`;
      console.log(link);
      let mailOptions = {
        from: "sharesecure0@gmail.com", // TODO: email sender
        to: user.local.email, // TODO: email receiver
        subject: "Password reset Link",
        text: "This is your password reset link :  " + link,
      };
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          return log("Error occurs");
        }
        return log("Email sent!!!");
      });

      res.send("password reset link has been sent to ur email.... ");
    });
  });
};
