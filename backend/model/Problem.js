// problem model
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  difficulty: { type: String, required: true },
  submissionPercentage: { type: Number },
  solution: { type: String },
  testCases: [testCaseSchema], // Reference the testCaseSchema
  constraints:{

  },
  time:{
    
  }
});

module.exports = mongoose.model('Problem', problemSchema);
