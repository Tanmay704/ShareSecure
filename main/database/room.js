const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
  const roomSchema = new Schema({
      admin:{type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
      roomname:{type:String},
      disc:{type:String},
      visible:{type: Boolean,require: true, default: true},
      key:{type:String},
      visiters:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      type: String,
      data: Buffer,
      created:{ type: Date, required: true, default: Date.now, timezone: 'Asia/Calcutta' }
  });
 
  roomSchema.methods.encryptBuffer = function(buffer,key) {
    var cipher = crypto.createCipher('aes-256-ctr',key);
    var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
  return crypted;
  };

  roomSchema.methods.decryptBuffer = function(buffer,key) {
    var decipher = crypto.createDecipher('aes-256-ctr',key);
    var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
  return dec;
  };
  
  module.exports  = mongoose.model('Room',roomSchema);