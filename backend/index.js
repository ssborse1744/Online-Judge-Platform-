const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db.js");
const User = require("./model/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {generateFile}= require("./generateFile");
const {executeCpp}=require("./executeCpp");
const {generateInputFile} = require("./generateInputFile");
const Submission = require('./model/Submission'); 
const Problem = require('./model/Problem.js');
const {executePython} = require("./executePython");
const {executeJava} = require("./executeJava");
// const validator = require('validator');
const problemRoutes = require('./routes/problemTag.route.js'); // Import the routes
dotenv.config();

// const userRoutes= require('./routes/user');
// express app
const app = express();
const PORT = process.env.PORT || 5050;

//middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/problems', problemRoutes); // Register the routes

// Auth middleware
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
  
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Invalid token.');
    }
  };

  const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send('Access Denied. You do not have the required permissions.');
    }
    next();
  };



//Connects to the MongoDB database.
DBConnection();

//A simple route to check if the server is running.
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

//routes

// app.use('api/user',userRoutes);

/*
Gets user data from the request body.
Checks if all required data is provided.
Checks if the user already exists.
Hashes the password for security.
Saves the new user in the database.
Creates a token for the user.
Sends back a success message and the user data (excluding the password).
*/
  app.post("/register", async (req, res) => {
      try {
          const { firstname, lastname, email,role, password } = req.body;

          if (!(firstname, lastname, email, role, password)) {
              return res.status(400).send("Please enter all the information");
          }

          // if(!validator.isEmail(email)){
          //   return res.status(400).send("Please enter a valid email");
          // }
          // if(!validator.isStrongPassword(password)){
          //   return res.status(400).send("Password is not strong enough");
          // }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(409).json({ error: "User already exists!" });          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await User.create({
              firstname,
              lastname,
              email,
              role,
              password: hashedPassword,
          });

          const token = jwt.sign(
            { id: user._id, email, role },
            process.env.SECRET_KEY,
            {expiresIn: "1d"});
          user.token = token;
          user.password = undefined;
          res.status(200).json({ message: "You have successfully registered!", user });
      } catch (error) {
          console.log(error);
          res.status(500).send("Internal Server Error register");
      }
  });

/*
Gets login data from the request body.
Checks if all required data is provided.
Finds the user in the database.
Compares the provided password with the stored hashed password.
If correct, generates a token for the user.
Sends back a success message and sets a cookie with the token.
*/


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email, password)) {
            return res.status(400).send("Please enter all the information");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id ,role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;

        const userResponse = {
          id: user._id,
          email: user.email,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
      };



        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulated by server not by client/user
        };
        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
            user: userResponse,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error login");
    }
});

//Post user
app.post('/users', async (req, res) => {
    try {
      const { firstname, lastname, email, role, password } = req.body;
  
      // Log the request body to verify the role field
      console.log('Request Body:', req.body);
  
      const newUser = new User({ firstname, lastname, email, role, password });
      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  //updating user
  app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { firstname, lastname, email, role, password } = req.body;
  
      // Log the request body to verify the role field
      console.log('Request Body:', req.body);
  
      const updatedUser = await User.findByIdAndUpdate(id, { firstname, lastname, email, role, password }, { new: true });
      res.status(200).send(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });
  
  app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    try {
      const users = await User.findById(req.params.id);
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(users);
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

    
app.get('/users/:id/profile',async(req,res)=>{
    try {
        const user =await User.findById(req.params.id);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('profile error',error.message);
    }
});

app.put('/users/:id/profile',async(req,res)=>{
    try {
        const { username, profilePhoto, questionsSolved } = req.body;
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { username, profilePhoto, questionsSolved },
          { new: true, runValidators: true }
        );
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(user);
      } catch (error) {
        res.status(500).send(error.message);
      }
});

// Correct route definition with '/api' prefix and proper parameter name
app.get('/api/users/:userId/solvedProblems', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('solvedProblems');
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Fetch solved problems for the user from the database
    const solvedProblems = user.solvedProblems.map(problem => problem._id);
    res.json({ solvedProblems });
  } catch (error) {
    console.error('Error fetching solved problems:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Add this route to get the current user's information
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('firstname lastname email role');
      if (!user) {
        return res.status(404).send('User not found.');
      }
      res.send({ user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

// Logout route
app.post('/api/auth/logout', authMiddleware, (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.send({ message: 'Successfully logged out' });
});

//problem route

app.post('/problems',async (req, res) => {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).send(problem);
});

app.get('/problems',async (req, res) => {
    const problems = await Problem.find();
    res.send(problems);
});

app.get('/problems/:id', async (req, res) => {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
      res.json(problem);
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.put('/problems/:id', async (req, res) => {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(problem);
});

app.delete('/problems/:id',async (req, res) => {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(204).send();
});



// Get all test cases for a problem
app.get('/problems/:id/testcases', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).send('Problem not found');
        }
        res.json(problem.testCases);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a test case to a problem
app.post('/problems/:id/testcases', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).send('Problem not found');
        }
        const { input, output } = req.body;
        problem.testCases.push({ input, output });
        await problem.save();
        res.status(201).send(problem.testCases);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a test case from a problem
app.delete('/problems/:id/testcases/:testCaseId', async (req, res) => {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).send('Problem not found');
      }
      
      const testCase = problem.testCases.find(tc => tc._id.toString() === req.params.testCaseId);
      if (!testCase) {
        return res.status(404).send('Test case not found');
      }
      
      // Remove the test case from the problem's testCases array
      problem.testCases.pull(testCase);
      
      await problem.save();
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
   
  app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language , code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);

      let output;
      switch (language) {
          case 'cpp':
              output = await executeCpp(filePath, inputPath);
              break;
          case 'java':
              output = await executeJava(filePath, inputPath);
              break;
          case 'python':
              output = await executePython(filePath, inputPath);
              break;
          default:
              throw new Error("Unsupported language");
      }
        res.json({ filePath, inputPath, output });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error });
    }
});



  // Submit a solution
  app.post("/submit", authMiddleware, async (req, res) => {
      const { problemId, solution, language , input } = req.body;
  
      if (!problemId || !solution) {
          return res.status(400).json({ success: false, error: "Please provide problem ID and solution" });
      }
  
      try {
          // Generate files
          const filePath = await generateFile(language, solution);
          const inputPath = await generateInputFile(input);
  
         // Execute the code based on language
         let output;
         switch (language) {
             case 'cpp':
                 output = await executeCpp(filePath, inputPath);
                 break;
             case 'java':
                 output = await executeJava(filePath, inputPath);
                 break;
             case 'python':
                 output = await executePython(filePath, inputPath);
                 break;
             default:
                 throw new Error("Unsupported language");
         }
         console.log(`Generated Output: ${output.trim()}`);
            // Fetch the problem details
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
  
          let verdict = 'Accepted';
          let testNumber = 0;
          for (let testCase of problem.testCases) {
            testNumber++;
            const inputPath = await generateInputFile(testCase.input);
            const output = await executeCpp(filePath, inputPath);
              console.log(`Comparing with Expected Output: ${testCase.output.trim()} ${output}`);
              if (output.trim() !== testCase.output.trim()) {
                  verdict = `Wrong answer on test ${ testNumber}`;
                  break; // Uncomment this if you want to stop on first wrong answer
              }
          }
  
  
          // Save the submission
          const newSubmission = new Submission({
              userId: req.user.id,
              problemId,
              solution,
              output: output.trim(),
              verdict
          });
          await newSubmission.save();
            // If verdict is Accepted, update user's solvedProblems array
          if (verdict === 'Accepted') {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.solvedProblems.includes(problemId)) {
                user.solvedProblems.push(problemId);
                await user.save();
            }
          }
          res.status(201).json({ message: "Submission recorded successfully", verdict });
      } 
      catch (error) {
        // if(error.killed){
        //     verdict = `Time limit exceeded on test ${testNumber}`;
        //     break;
        // }
        // else if(error.stderr){
        //     verdict = `Runtime error on test ${testNumber}: ${error.stderr}`;
        //     break;
        // }
        // else{
        //     verdict = `Error on test ${testNumber}: ${error.message}`;
        //     break;
        // }
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  });

  // Get all submissions route
// Get all submissions route
app.get('/submissions', authMiddleware, async (req, res) => {
  try {
    const submissions = await Submission.find()
    .populate('userId', 'email') // Example: Populate user's firstname and lastname
    .populate('problemId', 'name') // Populate problem's name
  
      .sort({ date: -1 }); // Sort by date in descending order
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});


// Get all submissions for a specific problem
app.get('/submissions/:problemId', authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({ problemId: req.params.problemId });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Determine verdict of the submitted code
  const determineVerdict = async (output, problemId) => {
    try {
        // Fetch the problem details
        const response = await axios.get(`http://localhost:5050/problems/${problemId}`);
        const problem = response.data;

        // Compare the output with each test case
        for (let testCase of problem.testCases) {
            if (output.trim() === testCase.output.trim()) {
                return 'Correct';
            }
        }

        return 'Incorrect';
    } catch (error) {
        console.error('Error determining verdict:', error);
        return 'Error';
    }
};

// Endpoint to get unique tags
app.get('/tags', async (req, res) => {
  try {
    const tags = await Problem.distinct('tag');
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
