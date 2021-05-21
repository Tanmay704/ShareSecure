const errorHandler = require('errorhandler');
const bcrypt   = require('bcrypt-nodejs');
var randomstring = require("randomstring");
module.exports = function(router , passport){
    router.get('/createroom', isLoggedIn, function(req, res) {
        res.render('createroom.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    router.post('/createroom',isLoggedIn, function(req, res){
        const admin = req.user;
        const roomdetail = req.body;
        //find admin 
        //create room
        //add room
        //create key for room
        // show room to dashboard with key 
        const roomModel = require('../database/room');
        const adminModel = require('../database/admin');
        var room = new roomModel();
        room.roomname = roomdetail.roomname;
        room.disc = roomdetail.disc;
        room.key = randomstring.generate({
                     length: 12,
                     charset: 'alphabetic'
                   });
        room.admin = admin._id;
        room.save(function(err,data){
            if(err) return errorHandler(err);
            else{
                adminModel.findById({'_id':data.admin},function(err,doc){
                       if(err) return errorHandler;
                       else{
                           doc.rooms.push(data._id);
                           doc.save();
                       }
                });
            }
        });
        res.redirect('/dashboard');
    });
    
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
