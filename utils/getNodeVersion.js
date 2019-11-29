const semver = require("semver");
const getNodeVersion = () => {
  return semver.clean(process.version);
};

module.exports = getNodeVersion;
