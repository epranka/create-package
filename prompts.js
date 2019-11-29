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
const isSilentMode = options.silent;
const author = options.author;
const email = options.email;
const umdBuild = !!options.umd;
const umdName = options.umd;
const esBuild = !!options.es;
const useTravis = !!options.travis;
const repository = options.repository;
const useSemanticRelease = !!options.semanticRelease;
const useTests = !!options.tests;
const useNPM = !!options.npm;
const type = options.type || "ts";

const required = message => value => {
  return value && value.trim() ? true : message;
};

module.exports = [
  {
    name: "name",
    message: "Package name",
    default: name ? name : "{outFolder}",
    validate: required("Package name is required")
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
    validate: required(
      "If you want to build UMD module, the global name of the package is required"
    ),
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
    message: "Repository URL",
    validate: (value, answers) => {
      if (answers && (answers["useSemanticRelease"] || answers["useTravis"])) {
        return required(
          "If you want to use semantic releases or travis ci, the repository URL is required"
        )(value);
      } else if (
        !answers &&
        isSilentMode &&
        (useSemanticRelease || useTravis)
      ) {
        return required(
          "If you want to use semantic releases or travis ci, the repository URL is required"
        )(value);
      } else return true;
    },
    default:
      typeof repository !== "undefined"
        ? repository
        : getRepositoryURL() || undefined
  }
];
