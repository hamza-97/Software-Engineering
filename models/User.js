const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  contact:{
   type: String,
   required: true 
  },
  CNIC:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
//   confirmpassword:{
//   type: String,
//   required: true
// },
  
// radio:{
//   type: String, possibleValues: ['writer','producer'],
//     required: true
//   }, 

});

mongoose.model('users', UserSchema);