"use strict";

module.exports = function(router, passport){
router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin.ejs', { message: req.flash('loginMessage') });
});

router.post('/adminlogin', passport.authenticate('local-login', {
  successRedirect : '/dashboard', // redirect to the secure profile section
  failureRedirect : '/adminlogin', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

}
