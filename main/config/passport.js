var LocalStrategy   = require('passport-local').Strategy;
var User        = require('../database/admin');
var Visiter = require('../database/user');
require('dotenv').config();
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


const GoogleStrategy = require('passport-google-oauth20');


passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret:  process.env.clientSecret,
    callbackURL: process.env.callbackURL,
  },

function(accessToken, refreshToken, profile, cb) {
    Visiter.findOrCreate({ googleId: profile.id , username:profile.displayName, email:profile.emails[0].value}, function (err, user) {
      return cb(err, user);
    });
  }
));



    passport.use('local-signup', new LocalStrategy({
        
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function (req, email, password, done) {
       
            // emailExistence.check(email, function(res,err){
            //     console.log('res: '+ res);
            // });
      

           
            User.findOne({'local.email': email}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    console.log('that email exists');
                    return done(null, false, req.flash('signupMessage', email + ' is already in use. '));

                } else {
                    User.findOne({'local.username': req.body.username}, function (err, user) {
                        if (user) {
                            console.log('That username exists');
                            return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                        }
                        if (req.body.password != req.body.confirm_password) {
                            console.log('Passwords do not match');
                            return done(null, false, req.flash('signupMessage', 'Your passwords do not match'));
                        }
                        else {
                            // create the user
                            var newUser = new User();
                            newUser.local.username = req.body.username;
                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                }
            });
    }));

    
    passport.use('local-login', new LocalStrategy({
      
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, email, password, done) { 
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
            return done(null, user);
        });

    }));

};