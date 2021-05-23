const errorHandler = require('errorhandler');
var randomstring = require("randomstring");
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const room = require('../database/room');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });



module.exports = function(router , passport){
    router.get('/createroom', isLoggedIn, function(req, res) {
        res.render('createroom.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
    router.post('/createroom',isLoggedIn, upload.single('file') ,function(req, res){
        const admin = req.user;
        const roomdetail = req.body;
        const roomModel = require('../database/room');
        const adminModel = require('../database/admin');
        var newkey = randomstring.generate({
                     length: 12,
                     charset: 'alphabetic'
                   });
        // add code to store file 
        var buffer = fs.readFileSync(path.join(__dirname , '../public/uploads/' + req.file.filename ));
        // delete file 
        var room = new roomModel( {
          admin:admin._id,
          roomname:roomdetail.roomname,
          disc: roomdetail.disc,
          key:newkey,
        });
        room.data = room.encryptBuffer(buffer,admin.local.password);
        room.type = 'image/png';
        // removing file 
        try {
            fs.unlinkSync(path.join(__dirname , '../public/uploads/' + req.file.filename ));
            //file removed
          } catch(err) {
            console.error(err);
          }
        // removed file 
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
