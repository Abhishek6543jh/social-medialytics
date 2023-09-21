const { spawn } = require('child_process');
var usr ="ravitechseries"
// Define the Python script and its arguments
const pythonScript = '/Users/kalthireddyabhishek/lab/webprojetc/instagram.py'; // Replace with the path to your Python script
const pythonArgs = [usr]; // Replace with any arguments your Python script requires

// Run the Python script
const pythonProcess = spawn('python3', [pythonScript, ...pythonArgs]);

// Handle Python script output
pythonProcess.stdout.on('data', (data) => {
  console.log(`Python Output: ${data}`);
});

// Handle any errors that occur
pythonProcess.stderr.on('data', (data) => {
  console.error(`Error: ${data}`);
});

// Handle the Python script's exit event
pythonProcess.on('close', (code) => {
  console.log(`Python script exited with code ${code}`);
});


