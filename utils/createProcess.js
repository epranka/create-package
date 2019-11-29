const spawn = require("cross-spawn");

const createProcess = (command, args, options) => {
  return new Promise((resolve, reject) => {
    const pr = spawn.spawn(command, args, options);
    let stdout = "";
    let stderr = "";
    pr.stdout.on("data", data => (stdout += data.toString()));
    pr.stderr.on("data", data => (stderr += data.toString()));
    pr.on("close", code => {
      if (code === 0) resolve(stdout);
      else reject(stderr);
    });
  });
};

module.exports = createProcess;
