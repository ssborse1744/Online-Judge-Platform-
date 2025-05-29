const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath,inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`); // Windows executable extension

    return new Promise((resolve, reject) => {
        // Windows command - use && to chain commands and proper path separators
        const compileCmd = `g++ "${filepath}" -o "${outPath}"`;
        const runCmd = `"${outPath}" < "${inputPath}"`;
        const fullCmd = `${compileCmd} && ${runCmd}`;
        
        exec(fullCmd, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            }
            if (stderr) {
                reject(stderr);
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    executeCpp,
};
