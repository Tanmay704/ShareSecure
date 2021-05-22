"use strict";
var bodyparser = require('body-parser')
const {check ,validationResult } = require('express-validator');
var urlencoderParser =bodyparser.urlencoded({extended : false})
module.exports = function(router , passport){
router.get('/adminregister',function(req, res, next){
  res.render('adminregister.ejs',{ message: req.flash('signupMessage') });
}); 

router.post('/adminregister',urlencoderParser,[
  check('username','User Name Having At Least Of 5 Characters').trim().isLength({min : 5}),
  check('username','White Space Not Allowed').not().matches(/^$|\s+/),
  check('username','Username Having Special Character Not Allowed').not().matches(/(?=.?[#?!@$%^&-])/),
  check('password','Password Must Be A 8 Characters').trim().isLength({min : 8}),
  check('password','Password Must Be Having At Least One Special Character').matches(/(?=.?[#?!@$%^&-])/),//('^[!@#$%^&()_+-=[]{};:"\|,.<>/?]$/')
  check('password','At least One Uppercase Character').matches(/(?=.?[A-Z])/),
  check('password','At least One Lowercase Character').matches(/(?=.?[a-z])/),
  check('password','At least One Number').matches(/(?=.*?[0-9])/),
  check('password','White Space Not Allowed').not().matches(/^$|\s+/)
],checkpassword,passport.authenticate('local-signup', {
  successRedirect : '/dashboard', // redirect to the secure profile section
  failureRedirect : '/adminregister', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

}


function checkpassword(req, res, next) {
const errors = validationResult(req);
console.log(errors.mapped());
if(!errors.isEmpty()){
res.render('adminregister.ejs',{error : errors.mapped()});}
else {return next();}
}