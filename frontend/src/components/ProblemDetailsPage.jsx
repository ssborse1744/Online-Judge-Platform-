import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import Split from "react-split";

// Import ACE editor modes and themes
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/ext-language_tools";

import NavBar from "./NavBar";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import "../App.css"; // Import your CSS file

const ProblemDetailsPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [code, setCode] = useState(`
  #include <bits/stdc++.h> 
  using namespace std;

  // Define the main function
  int main() { 
   cout<<"Hello World!"<<endl;
   return 0; 
  }
  
  `);
  const getInitialCode = (language) => {
    switch (language) {
      case "cpp":
        return `#include <bits/stdc++.h> 
using namespace std;

// Define the main function
int main() { 
 cout<<"Hello World!"<<endl;
 return 0; 
}`;
      case "python":
        return `# This program prints Hello, world!

print('Hello World!')`;
      case "java":
        return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`;
      default:
        return "";
    }
  };

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [selectedTheme, setSelectedTheme] = useState("monokai"); // Default theme

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("http://localhost:5050/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchProblemDetails();
    fetchTestCases();
  }, [problemId]);

  const fetchProblemDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/problems/${problemId}`
      );
      setProblem(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching problem details:", error);
      setError("Error fetching problem details");
      setLoading(false);
    }
  };

  const fetchTestCases = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/problems/${problemId}/testcases`
      );
      setTestCases(response.data);
    } catch (error) {
      console.error("Error fetching test cases:", error);
      setError("Error fetching test cases");
    }
  };

  const handleRun = async () => {
    const payload = {
      language: selectedLanguage,
      code,
      input,
    };

    try {
      const { data } = await axios.post("http://localhost:5050/run", payload);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      problemId,
      language: selectedLanguage,
      solution: code,
      input,
    };
    console.log(payload);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const { data } = await axios.post(
        "http://localhost:5050/submit",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data && data.verdict) {
        setVerdict(data.verdict);
        setOutput(data.verdict); // Assuming setOutput is a state function to display the output
      } else {
        console.error("Invalid response data:", data);
        setOutput("Error: Invalid response from server");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      setOutput("Error: Failed to submit code");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const toggleTestCaseSelection = (id) => {
    setSelectedTestCases((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((tcId) => tcId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
  };  const getColorClass = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700 border border-green-300"; // Green background for easy
      case "medium":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300"; // Yellow background for medium
      case "hard":
        return "bg-red-100 text-red-700 border border-red-300"; // Red background for hard
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300"; // Default gray background
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <NavBar user={currentUser} onLogout={handleLogout} />
      <Split
        className="flex flex-1 split"
        direction="horizontal"
        minSize={200}
        sizes={[50, 50]}
      >        {/* Left Pane */}
        <div className="overflow-auto p-6 bg-white rounded-lg shadow-lg m-2">
          {problem ? (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{problem.name}</h2>
                <div style={{ display: "inline-block" }}>
                  <span
                    className={`text-sm font-bold px-4 py-2 rounded-full ${getColorClass(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-lg text-black mb-4 whitespace-pre-wrap">
                {renderDescription(problem.description)}
              </p>
              {/*               
              <h3 className="text-lg font-bold mb-2">Test Cases</h3>
              <ul className="list-disc list-inside">
                {testCases.map((testCase) => (
                  <li key={testCase._id} className="mb-2">
                    <strong>Input:</strong>
                    <pre className="bg-gray-100 p-2 rounded">{testCase.input}</pre>
                    <strong>Output:</strong>
                    <pre className="bg-gray-100 p-2 rounded">{testCase.output}</pre>
                  </li>
                ))}
              </ul> */}              <h3 className="text-xl font-bold mb-3 text-gray-700 border-b-2 border-green-500 pb-2">Constraints</h3>
              <p className="mb-6 text-gray-600 bg-gray-50 p-4 rounded-lg">{problem.constraints}</p>              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-bold text-green-700">Time Limit</h3>
                  <p className="text-green-600 font-semibold">1 second</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                  <h3 className="text-lg font-bold text-teal-700">Memory Limit</h3>
                  <p className="text-teal-600 font-semibold">100 MB</p>
                </div>
              </div>
            </>
          ) : (
            <p>No problem data available</p>
          )}
        </div>        {/* Right Pane */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow-lg m-2">
      
            <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-lg">
              <span className="text-lg font-semibold mr-3 text-gray-700">Theme:</span>
              <select
                value={selectedTheme}
                onChange={handleThemeChange}
                className="select-box border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              >
                <option value="monokai">Monokai</option>
                <option value="github">GitHub</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="twilight">Twilight</option>
                <option value="xcode">XCode</option>
                <option value="solarized_light">Solarized Light</option>
                <option value="solarized_dark">Solarized Dark</option>
                <option value="kuroir">Kuroir</option>
                <option value="terminal">Terminal</option>
                <option value="vibrant_ink">Vibrant Ink</option>
              </select>              <span className="text-lg font-semibold ml-6 mr-3 text-gray-700">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setCode(getInitialCode(e.target.value)); // Update code template based on selected language
                }}
                className="select-box border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
          
            <div
              className="bg-white shadow-md rounded-lg p-4 mb-4"
              style={{ height: "400px" }}
            >              <AceEditor
                mode={selectedLanguage === "cpp" ? "c_cpp" : selectedLanguage === "python" ? "python" : "java"} // Set Ace Editor mode dynamically
                theme={selectedTheme}
                name="editor"
                value={code}
                onChange={setCode}
                fontSize={14}
                width="100%"
                height="100%"
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 4,
                }}
              />
            </div>            <div className="flex justify-between mb-6 space-x-4">
              <div className="w-1/2">
                <h2 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  Input
                </h2>
                <textarea
                  rows="5"
                  value={input}
                  placeholder="Enter your test input here..."
                  onChange={(e) => setInput(e.target.value)}
                  className="border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none w-full transition duration-300 shadow-sm"
                ></textarea>
              </div>
              <div className="w-1/2">
                <h2 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  Output
                </h2>
                <div
                  className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm"
                  style={{ minHeight: "140px" }}
                >
                  <pre
                    className="whitespace-pre-wrap text-gray-800"
                    style={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                  >
                    {output || "Output will appear here..."}
                  </pre>
                </div>
              </div>
            </div>            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={handleRun}
                className="bg-blue-500 hover:bg-blue-600 focus:outline-none text-white font-semibold rounded-lg text-sm px-6 py-3 shadow-md transition duration-300 transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 inline-block align-middle me-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                Submit Solution
              </button>
            </div>
          
            </div>
      </Split>
    </div>
  );
};

const renderDescription = (description) => {
  // Regular expression to find **text** or __text__ and replace with <span class="font-bold">text</span>
  const boldPattern = /(\*\*|__)(.*?)\1/g;

  // Replace the pattern with the span tag for bold styling
  const processedDescription = description.replace(
    boldPattern,
    (match, p1, p2) => {
      return `<span class="font-bold">${p2}</span>`;
    }
  );

  // Use dangerouslySetInnerHTML to render HTML content
  return <span dangerouslySetInnerHTML={{ __html: processedDescription }} />;
};

export default ProblemDetailsPage;
