const mongoose = require('mongoose');

const SolutionSchema = new mongoose.Schema({
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    verdict : String,
    submitted_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Solution', SolutionSchema);
