"use strict";
const roomModel = require('../database/room');
module.exports = function(router){
router.get('/userlogin', function(req, res, next) {
  res.render('userlogin.ejs');
});


router.post('/userlogin', function(req, res, next) {
    const key = req.body.key;
    roomModel.findOne({ 'key':key }, function(err, room) {
        if (err) {
          return errorHandler;
        } else {
          if(!room){
            res.send("key is not valid .. ");
          }else{
              res.send("Room Found ..."+room.roomname);
          }
        }
      });
  });
}