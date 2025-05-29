const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const javaFilePath = path.join(outputPath, `${jobId}.java`);

    return new Promise((resolve, reject) => {
        fs.copyFile(filepath, javaFilePath, (err) => {
            if (err) {
                reject(err);
            } else {
                // Windows: Use quoted paths and proper class path separator
                const compileCmd = `javac "${javaFilePath}"`;
                const runCmd = `java -classpath "${outputPath}" ${jobId} < "${inputPath}"`;
                const fullCmd = `${compileCmd} && ${runCmd}`;
                
                exec(fullCmd, { cwd: outputPath }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Java execution error: ${error}`);
                        reject({ error, stderr });
                    } else if (stderr) {
                        console.error(`Java stderr: ${stderr}`);
                        reject(stderr);
                    } else {
                        console.log(`Java stdout: ${stdout}`);
                        resolve(stdout);
                    }
                });
            }
        });
    });
};

module.exports ={
    executeJava,
};