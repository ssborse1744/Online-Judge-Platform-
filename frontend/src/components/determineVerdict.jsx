// frontend/src/components/determineVerdict.js
import Problem from '../../../backend/model/problem.js';

const handleRun = async () => {
    const payload = {
      language: 'cpp',
      code,
      input
    };

    try {
      const { data } = await axios.post('https://backend.oj-online-judge.site/run', payload);
      console.log(data);
      setOutput(data.output); 
    } catch (error) {
      console.log(error.response);
    }
  }
// Function to determine the verdict of a code submission
// Assuming this is in determineVerdict.js

export default async function determineVerdict(problemId, output) {
    // try {
      // Fetch the problem from the database
    //   const problem = await Problem.findById(problemId).populate('testCases');
    //   if (!problem) {
    //     throw new Error('Problem not found');
    //   }
  
    //   // Logic to determine the verdict based on the output and test cases
    //   for (const testCase of problem.testCases) {
    //     if (output.trim() !== testCase.output.trim()) {
    //       return 'Wrong Answer';
    //     }
    //   }
    //   return 'Accepted';
    // } catch (error) {
    //   console.error('Error determining verdict:', error.message);
    //   return 'Internal Server Error';
    // }
  }
