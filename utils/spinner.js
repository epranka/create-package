const ora = require("ora");

const spinner = async (
  processCallback,
  { startMessage, endMessage, failMessage }
) => {
  const sp = ora(startMessage).start();
  try {
    if (processCallback instanceof Promise) {
      await processCallback;
    } else if (typeof processCallback === "function") {
      await processCallback();
    }
    sp.stopAndPersist({
      symbol: "✓",
      text: endMessage
    });
  } catch (err) {
    console.error();
    console.error(err);
    sp.stopAndPersist({
      symbol: "✗",
      text: failMessage
    });
    process.exit(1);
  }
};

module.exports = spinner;
