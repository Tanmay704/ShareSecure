const mongoose = require('mongoose');
  const { Schema } = mongoose;
  const roomSchema = new Schema({
      admin:{type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
      roomname:{type:String},
      disc:{type:String},
      visible:{type: Boolean,require: true, default: true},
      key:{type:String},
      visiter:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      file:{
        type: String,
        data: Buffer
      },
      created:{ type: Date, required: true, default: Date.now }
  });

  module.exports  = mongoose.model('Room',roomSchema);