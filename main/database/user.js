var findOrCreate = require('mongoose-findorcreate');
const mongoose = require('mongoose');
  const { Schema } = mongoose;
  const userSchema = new Schema({
    username:String,
    email: String,
    googleId: String,
    visited:{ type: Date, required: true, default: Date.now, tz: 'Asia/Calcutta' }
  });
userSchema.plugin(findOrCreate);
 module.exports = mongoose.model('User',userSchema);
