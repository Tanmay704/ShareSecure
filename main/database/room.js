const mongoose = require('mongoose');
  const { Schema } = mongoose;
  const roomSchema = new Schema({
    
  });

  const Room = mongoose.model('Room',roomSchema);
  module.exports =  {Room,roomSchema};