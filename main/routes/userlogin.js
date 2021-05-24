"use strict";
const roomModel = require('../database/room');
module.exports = function(router){
router.get('/userlogin', function(req, res, next) {
  res.render('userlogin.ejs',{ message:'' });
});


router.post('/userlogin', function(req, res, next) {
    const key = req.body.key;
    roomModel.findOne({ 'key':key }, function(err, room) {
        if (err) {
          return errorHandler;
        } else {
          if(!room){
            res.render('userlogin.ejs',{ message: 'Enter a valid key ...'});
          }else{
              room.populate("admin").execPopulate(()=>{
              if(room.visible === true){
                res.render('room.ejs', {
                  myroom : room , img : room.decryptBuffer(room.data,room.admin.local.email)
                });
              }else{
                  res.render('userlogin.ejs',{ message: 'room is disabled contact '+ room.admin.local.email}); 
              }
            });
          }
        }
      });
  });
}