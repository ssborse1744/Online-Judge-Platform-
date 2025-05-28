const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executePython = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const pythonScriptPath = path.join(outputPath, `${jobId}.py`);

    return new Promise((resolve, reject) => {
        fs.copyFile(filepath, pythonScriptPath, (err) => {
            if (err) {
                reject(err);
            } else {
                const pythonProcess = exec(
                    `python ${pythonScriptPath}`, // Command to execute Python script
                    { cwd: outputPath },
                    (error, stdout, stderr) => {
                        if (error) {
                            reject({ error, stderr });
                        } else if (stderr) {
                            reject(stderr);
                        } else {
                            resolve(stdout);
                        }
                    }
                );

                // Provide input to the Python script
                const inputStream = fs.createReadStream(inputPath);
                inputStream.pipe(pythonProcess.stdin);
                pythonProcess.stdin.on('error', (err) => {
                    reject(`Error writing input to Python process: ${err}`);
                });
            }
        });
    });
};

module.exports = {
    executePython,
};
