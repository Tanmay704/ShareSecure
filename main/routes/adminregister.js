"use strict";
module.exports = function(router , passport){
router.get('/adminregister', function(req, res, next){
  res.render('adminregister.ejs',{ message: req.flash('signupMessage') });
}); 

router.post('/adminregister', passport.authenticate('local-signup', {
  successRedirect : '/dashboard', // redirect to the secure profile section
  failureRedirect : '/adminregister', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

}