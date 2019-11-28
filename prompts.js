const getRepositoryURL = require("./utils/repository");
const { random } = require("superb");

const { options } = global["parsedArgs"];
let license = "isc";
if (options["mit"]) {
  license = "mit";
}
if (options["unlicensed"]) {
  license = "unlicensed";
}
const name = options.name;
const description = options.description;
const author = options.author;
const email = options.email;
const umdBuild = !!options.umd;
const umdName = options.umd;
const esBuild = !!options.es;
const useTravis = !!options.travis;
const useSemanticRelease = !!options.semanticRelease;
const useTests = !!options.tests;
const useNPM = !!options.npm;
const type = options.type || "ts";

module.exports = [
  {
    name: "name",
    message: "Package name",
    default: name ? name : "{outFolder}"
  },
  {
    name: "description",
    message: "Package description",
    default: description ? description : `My ${random()} package`
  },
  {
    name: "type",
    message: "Package type",
    choices: [
      {
        name: "Typescript (TS)",
        value: "ts"
      },
      {
        name: "React Typescript (TSX)",
        value: "tsx"
      },
      {
        name: "Javascript (JS)",
        value: "js"
      },
      {
        name: "React Javascript (JSX)",
        value: "jsx"
      }
    ],
    type: "list",
    default: type
  },
  {
    name: "author (public)",
    message: "Full name of package author",
    default: author
  },
  {
    name: "email",
    message: "Email of package author (public)",
    default: email
  },
  {
    name: "license",
    message: "Select license",
    choices: [
      {
        name: "ISC",
        value: "isc"
      },
      {
        name: "MIT",
        value: "mit"
      },
      {
        name: "Unlicensed",
        value: "unlicensed"
      }
    ],
    type: "list",
    default: license
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
    name: "useUMD",
    message: "Build to UMD module for browsers (CommonJS is default) ?",
    type: "confirm",
    default: umdBuild
  },
  {
    name: "umdName",
    message:
      "What is a global name of your package in browser (e.g. React, ReactDOM) ?",
    default: umdName,
    when: answers => {
      if (answers["useUMD"]) return true;
      return false;
    }
  },
  {
    name: "useEs",
    message: "Build to ES Module ?",
    type: "confirm",
    default: esBuild
  },
  {
    name: "useTests",
    message: "Use unit tests ?",
    type: "confirm",
    default: useTests
  },
  {
    name: "useSemanticRelease",
    message: "Use automatic semantic releases ?",
    type: "confirm",
    default: useSemanticRelease
  },
  {
    name: "useTravis",
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
