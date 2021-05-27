"use strict";
require('dotenv').config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports = function (router) {
   const JWT_SECRET = "some super secret...";
   var User = require("../database/admin");
 
   let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Mail,
        pass: process.env.MailPass,
      },
    });

  router.get("/forgotpassword", function (req, res, next) {
    res.render("forgotpassword.ejs",{message:''});
  });

  router.post("/forgotpassword", function (req, res, next) {
    const { email } = req.body;
    User.findOne({ "local.email": email }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log("that email do not exists");
        res.render("forgotpassword.ejs",{message:email + ' does not exists'});
        return ;
      }
      const secret = JWT_SECRET + user.local.password;
      const payload = {
         email: user.local.email,
         username: user.local.username,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const callback = 'https://localhost:3000/resetpassword/';
      const link = callback+`${user.local.username}/${token}`;
      console.log(link);
      let mailOptions = {
         from: process.env.Mail, 
         to: user.local.email,
         subject: "Password reset Link : ",
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
