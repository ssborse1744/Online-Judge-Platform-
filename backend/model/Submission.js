const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    solution: { type: String, required: true },
    output: { type: String, required: true },
    verdict: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// SubmissionSchema.post('save', async function (doc) {
//     if (doc.verdict === 'Accepted') {
//       const user = await mongoose.model('User').findById(doc.userId);
//       if (!user.solvedProblems.includes(doc.problemId)) {
//         user.solvedProblems.push(doc.problemId);
//         user.problem_count = user.solvedProblems.length;
//         await user.save();
//       }
//     }
//   });

module.exports = mongoose.model('Submission', SubmissionSchema);
