const admin = require('../database/admin');
const adminModel = require('../database/admin');
module.exports = function(router , passport){
    
  
    router.get('/dashboard', isLoggedIn, function(req, res) {
        adminModel.findOne(
            { _id:req.user._id},
            (err, data) => {
                if (err) {
                 res.status(422).send("Our fault");
                }
                data.populate("rooms").execPopulate(() => {
                  res.render('dashboard.ejs', {
                     user : data
                  });
               });
            }
        );
    });
    
    
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

}

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
