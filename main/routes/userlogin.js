"use strict";
const roomModel = require('../database/room');
module.exports = function(router){
router.get('/userlogin', function(req, res, next) {
  res.render('userlogin.ejs',{ message: req.flash('roomMessage') });
});


router.post('/userlogin', function(req, res, next) {
    const key = req.body.key;
    roomModel.findOne({ 'key':key }, function(err, room) {
        if (err) {
          return errorHandler;
        } else {
          if(!room){
            res.render('userlogin.ejs',{ message: req.flash('roomMessage', 'key' + ' is not valid. ')})
          }else{
            room.populate("admin").execPopulate(()=>{
              res.render('room.ejs', {
                myroom : room
              });
            });
          }
        }
      });
  });
}