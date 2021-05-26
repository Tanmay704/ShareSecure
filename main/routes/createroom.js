const errorHandler = require('errorhandler');
var randomstring = require("randomstring");
var fs = require('fs');
var path = require('path');
var multer = require('multer');
require('dotenv').config();
//const mongooseUniqueValidator = require('mongoose-unique-validator');
const roomModel = require('../database/room');
const adminModel = require('../database/admin');
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
        var newlimit = 100;
        if(roomdetail.limit) newlimit = roomdetail.limit;
        var room = new roomModel( {
           admin:admin._id,
           roomname:roomdetail.roomname,
           disc: roomdetail.disc,
           key:newkey,
           limit:newlimit
        });
        room.data = room.encryptBuffer(buffer,admin.local.email);
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
    router.use( function( req, res, next ) {
        if ( req.query._method == 'DELETE' ) {
            req.method = 'DELETE';
            req.url = req.path;
        } 
        next(); 
    });
    router.delete('/room/delete/:roomid/:adminid',isLoggedIn,function(req,res){
         const roomid = req.params.roomid;
         const adminid = req.params.adminid;
         // find the room ...
         // from user rooms list remove the id 
         //redirect to dashboard with update
         roomModel.findOneAndDelete({_id:roomid}, function(err,room){
                  if(err){
                      res.send(err);
                  }
                  console.log(roomid + 'deleted');
         });
          adminModel.findById(adminid,function(err,admin){
                    if(err){
                        res.send(err);
                    }
                   admin.rooms.pull(roomid);
                   admin.save();
                   res.redirect('/dashboard');
          });
          //
    });

    router.get('/room/view/:roomid',isLoggedIn,function(req,res){
        roomModel.findOne({ _id :req.params.roomid}, function(err, room) {
            if (err) {
              return errorHandler;
            } else {
              if(!room){
                res.send('room does not exists');
              }else{
                  room.populate("admin").populate("visiters").execPopulate(()=>{
                  res.render('roomsetting.ejs', {
                    myroom : room , img : room.decryptBuffer(room.data,room.admin.local.email)
                  });
                });
              }
            }
        });
    });
    router.get('/room/update/:roomid',isLoggedIn,function(req,res){
            roomModel.findOne({_id:req.params.roomid},function(err,room){
              if(err){
                return errorHandler;
               }
               if(!room){
                res.send('room does not exists');
               }
               res.render("roomupdate.ejs",{myroom:room});
            });
    });
    router.post('/room/update/:roomid',isLoggedIn,upload.single('file'),function(req,res){
           const data = req.body;
           roomModel.findOne({_id : req.params.roomid},function(err,room){
               if(err){
                return errorHandler;
               }
               if(!room){
                res.send('room does not exists');
               }
                room.populate("admin").execPopulate(()=>{
               if(data.roomname){
                 room.roomname = data.roomname;
               }
               if(data.limit){
                 room.limit = data.limit;
               }
               if(data.disc){
                room.disc = data.disc;
               }
               if(req.file){
                var buffer = fs.readFileSync(path.join(__dirname , '../public/uploads/' + req.file.filename ));
                room.data = room.encryptBuffer(buffer,room.admin.local.email);
                room.type = 'image/png';
                  try {
                      fs.unlinkSync(path.join(__dirname , '../public/uploads/' + req.file.filename ));
                    //file removed
                    } catch(err) {
                      console.error(err);
                  }
               }
               if(data.disable){
                 room.visible = false;
               }
               if(data.enable){
                room.visible = true;
              }
               if(data.changekey){
                room.key =  randomstring.generate({
                             length: 12,
                             charset: 'alphabetic'
                            });
               }
               room.save();
              });
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
