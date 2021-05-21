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
        // const roomModel = require('../database/room');
        // var room = new roomModel();
        // room.roomname = roomdetail.roomname;
        // room.disc = roomdetail.disc;
        // room.key = "sharewithme";
        // //room.admin = 
        // room.admin = admin._id;
        // roomModel.findOne().populate('admin');
        // console.log(room);
        // console.log(room.admin.username);
    });
}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}
