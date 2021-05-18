import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';
import { roomSchema as roomdb} from './room.js';
  const { Schema } = mongoose;
  const adminSchema = new Schema({
    username: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
    email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    hash: String,
    salt: String,
    rooms: [roomdb]
  });
  adminSchema.plugin(uniqueValidator, {message: 'is already taken.'});
  adminSchema.methods.setPassword = function(password){
     this.salt = crypto.randomBytes(16).toString('hex');
     this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  adminSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  };
  
  export { adminSchema };