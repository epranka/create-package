const getRepositoryURL = require("./utils/repository");
const { random } = require("superb");

const args = process.argv;
const useTravis = !args.includes("--no-travis");
const useTests = !args.includes("--no-tests");
const useSemanticRelease = !args.includes("--no-semantic-release");
const useNPM = args.includes("--npm");

module.exports = [
  {
    name: "name",
    message: "Package name",
    default: "{outFolder}"
  },
  {
    name: "description",
    message: "Package description",
    default: `My ${random()} TSX package`
  },
  {
    name: "pm",
    message: "Choose the package manager",
    choices: [
      { name: "Yarn", value: "yarn" },
      { name: "Npm", value: "npm" }
    ],
    type: "list",
    default: useNPM ? "npm" : "yarn"
  },
  {
    name: "tests",
    message: "Use unit tests ?",
    type: "confirm",
    default: useTests
  },
  {
    name: "semanticrelease",
    message: "Use automatic semantic releases ?",
    type: "confirm",
    default: useSemanticRelease
  },
  {
    name: "travis",
    message: "Use Travis ?",
    type: "confirm",
    default: useTravis
  },
  {
    name: "repository",
    message: "Respository URL",
    default: getRepositoryURL()
  }
];
