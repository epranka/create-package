const createMITLicense = require("./createMITLicense");
const createISCLicense = require("./createISCLicense");
const createUNLICENSEDLicense = require("./createUNLICENSEDLicense");

const createLicenseConfig = ({ license, year, author, email }) => {
  let definedLicense = "ISC";
  let licenseContent = createISCLicense({ year, author, email });
  if (license === "mit") {
    definedLicense = "MIT";
    licenseContent = createMITLicense({ year, author, email });
  } else if (license === "unlicensed") {
    definedLicense = "UNLICENSED";
    licenseContent = createUNLICENSEDLicense({
      year,
      author,
      email
    });
  }
  return { license: definedLicense, licenseContent: licenseContent };
};

module.exports = createLicenseConfig;
