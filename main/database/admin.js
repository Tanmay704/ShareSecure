const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
require('dotenv').config();
  const  Schema  = mongoose.Schema;
  const adminSchema = new Schema({
    local :{
        username:{type: String},
        password: {type: String},
        email: {type: String },
    },
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
  });
  
  adminSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(process.env.SALT), null);
  };

  adminSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };
  
 module.exports = mongoose.model('Admin',adminSchema);
  