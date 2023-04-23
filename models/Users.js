const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpires: {
    type: Date,
  },
  emailVerified:{
    type:Boolean,
    default:false
  },
  businesses:[
    {type:mongoose.Schema.Types.ObjectId,ref:"Business"}
  ]
},{timestamps:true});

module.exports = mongoose.model('Users', userSchema);
