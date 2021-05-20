const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const room = require('./room');
  const  Schema  = mongoose.Schema;
  const adminSchema = new Schema({
    local :{
        username:{type: String},
        password: {type: String},
        email: {type: String },
    },
    rooms: [room.roomSchema]
  });
  
  adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
  
 module.exports = mongoose.model('Admin',adminSchema);
  