"use strict";
const passport = require('passport');
const roomModel = require('../database/room');
const viewer = require('../database/user');
module.exports = function(router){
router.get('/google/userlogin',passport.authenticate('google', {failureRedirect: "/"}), function(req, res, next) {
    
     res.render('userlogin.ejs',{ message:'',visiter:req.user._id});
});

router.get('/auth/google/userlogin',passport.authenticate("google",{scope: ['profile', 'email']  }),function(req,res,next){
});



router.post('/room/visiter/:visiterid', function(req, res) {
    const key = req.body.key;
    const visiterid = req.params.visiterid;
    roomModel.findOne({ 'key':key }, function(err, room) {
        if (err) {
          return errorHandler;
        } else {
          if(!room){
            res.render('userlogin.ejs',{ message: 'Enter a valid key ...',visiter:visiterid});
          }else{
                 var oldvisiter = room.visiters.some(function (data) {
                                  return data.equals(visiterid);
                              });
              if(oldvisiter === false && room.limit === room.visiters.length){
                room.populate("admin").execPopulate(()=>{
                  res.render('userlogin.ejs',{ message: 'Visiter Limit is Over for room, contact ' +   room.admin.local.email,visiter:visiterid}); 
                });
              }else{
              room.populate("admin").execPopulate(()=>{
                viewer.findOne({_id:visiterid},function(err,doc){
                  if(err){
                    res.send("errorOccured");
                  }
                  if(doc.email !== room.admin.local.email){
                    room.visiters.pull(visiterid);
                    room.visiters.push(visiterid);
                    room.save();
                  }
                  doc.visited = Date.now();
                  doc.save();
               });
              if(room.visible === true){
                res.render('room.ejs', {
                  myroom : room , img : room.decryptBuffer(room.data,room.admin.local.email)
                });
              }else{
                  res.render('userlogin.ejs',{ message: 'room is disabled contact '+ room.admin.local.email,visiter:visiterid}); 
              }
            });
          }
          }
        }
      });
  });
}


