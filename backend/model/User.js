const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: '', // Empty string by default
    required: true,
  },
  lastname: {
    type: String,
    default: '', // Empty string by default
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  // username:{
  //   type:String,
  //   default:email,
  //   unique:true,
  //   required:true,
  // },
  role : {
    type: String,
    default: 'user', // Empty string by default
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  problemCount: {
    type: Number,
    default: 0, // Initialize with zero
  },
  profilePhoto: {
    type: String,
  },
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
  }]
});

module.exports = mongoose.model('User', userSchema);