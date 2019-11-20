const { random } = require("superb");

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
    default: "yarn"
  },
  {
    name: "tests",
    message: "Use unit tests ?",
    type: "confirm",
    default: true
  },
  {
    name: "semanticrelease",
    message: "Use automatic semantic releases ?",
    type: "confirm",
    default: true
  },
  {
    name: "repository",
    message: "Respository URL (required if semantic release enabled)"
  }
];
