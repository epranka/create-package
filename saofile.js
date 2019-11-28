const spawn = require("cross-spawn");
const validate = require("validate-npm-package-name");
const serializePackage = require("./utils/serializePackage");
const serializeTSConfig = require("./utils/serializeTSConfig");
const serializeRollupConfig = require("./utils/serializeRollupConfig");
const createRollupConfig = require("./utils/createRollupConfig");
const serializeBabelRC = require("./utils/serializeBabelRC");
const createTsConfig = require("./utils/createTsConfig");
const createEsLintConfig = require("./utils/createEsLintConfig");
const createTsLintConfig = require("./utils/createTsLintConfig");
const createREADME = require("./utils/createREADME");
const createMITLicense = require("./utils/createMITLicense");
const createISCLicense = require("./utils/createISCLicense");
const createUNLICENSEDLicense = require("./utils/createUNLICENSEDLicense");
const createJestConfig = require("./utils/createJestConfig");
const createBabelConfig = require("./utils/createBabelConfig");
const prompts = require("./prompts");

module.exports = {
  prompts: prompts,
  templateData() {
    const { cliOptions } = this.sao.opts;
    const name = this.answers.name;
    const description = this.answers.description;
    const type = this.answers.type;
    const author = this.answers.author;
    const email = this.answers.email;
    const year = new Date().getFullYear();
    const es = this.answers.es;
    const useTests = this.answers.tests;
    const repository = this.answers.repository;
    const umd = this.answers.umd;
    const umd_name = this.answers.umd_name;
    const isTypescript = type === "tsx" || type === "ts";
    const isReact = type === "tsx" || type === "jsx";

    if (!["ts", "tsx", "js", "jsx"].includes(type)) {
      console.error(
        this
          .chalk`{red No type ${type} is supported. Supported: js, jsx, ts, tsx}`
      );
      process.exit(1);
    }

    if (this.answers.umd) {
      if (!this.answers.umd_name || !this.answers.umd_name.trim()) {
        console.error(
          this
            .chalk`{red No global UMD name defined while UMD module build is enabled}`
        );
        process.exit(1);
      }
    }

    const package = {
      name: name,
      description: description,
      version: "0.0.1",
      private: cliOptions.private ? true : undefined,
      scripts: [{ build: "rollup -c" }, { watch: "rollup -cw" }],
      main: "lib/index.js",
      module: es ? "lib/index.es.js" : undefined,
      types: isTypescript ? "lib/index.d.ts" : undefined,
      files: ["lib"],
      publishConfig: { access: "public" },
      keywords: [],
      author: undefined,
      contributors: [],
      repository: repository
        ? {
            url: this.answers.repository
          }
        : undefined,
      license: "ISC",
      dependencies: [],
      devDependencies: [],
      peerDependencies: []
    };

    const authorObject = [];
    if (author) {
      authorObject.push(author);
      if (email) authorObject.push(`<${email}>`);
    }
    if (authorObject.length) {
      package.author = authorObject.join(" ");
      package.contributors.push(authorObject.join(" "));
    }

    if (useTests) {
      package.scripts.push({ test: "jest" });
      package.devDependencies.push({ jest: "^24.9.0" });

      if (isReact) {
        package.devDependencies.push(
          { enzyme: "^3.10.0" },
          { "react-test-renderer": "^16.8.6" },
          { "enzyme-adapter-react-16": "^1.10.0" }
        );
      }

      if (isTypescript) {
        package.devDependencies.push(
          { "@types/jest": "^24.0.23" },
          { "ts-jest": "^24.0.0" }
        );

        if (isReact) {
          package.devDependencies.push(
            { "@types/enzyme": "^3.10.3" },
            { "@types/enzyme-adapter-react-16": "^1.0.5" }
          );
        }
      }
    } else {
      package.scripts.push({
        test: 'echo \\"Warn: No test specified\\" && exit 0"'
      });
    }

    if (isReact) {
      package.devDependencies.push({ react: "*" }, { "react-dom": "*" });
      package.peerDependencies.push({ react: "*" }, { "react-dom": "*" });
    }

    if (isTypescript) {
      package.devDependencies.push({ typescript: "^3.3.3333" });
      package.types = "lib/index.d.ts";

      if (isReact) {
        package.devDependencies.push(
          { "@types/react": "^16.8.5" },
          { "@types/react-dom": "^16.8.2" }
        );
      }
    }

    const rollupConfig = createRollupConfig({
      es,
      useTests,
      umd,
      umd_name,
      isReact,
      isTypescript
    });
    package.devDependencies.push(...rollupConfig.devDependencies);

    const babelConfig = createBabelConfig({ isReact });
    package.devDependencies.push(...babelConfig.devDependencies);

    let tsconfigConfig;
    if (isTypescript) {
      tsconfigConfig = createTsConfig({ isReact, useTests });
    }

    let licenseContent = createISCLicense({ year, author, email });

    if (this.answers.license === "mit") {
      package.license = "MIT";
      licenseContent = createMITLicense({ year, author, email });
    } else if (this.answers.license === "unlicensed") {
      package.license = "UNLICENSED";
      licenseContent = createUNLICENSEDLicense({
        year,
        author,
        email
      });
    }

    if (this.answers.semanticrelease) {
      package.version = "0.0.0-semantically-released";
      package.scripts.push({
        "semantic-release": "semantic-release"
      });
      package.scripts.push({
        cz: "git-cz"
      });
      if (!this.answers.repository || !this.answers.repository.trim()) {
        console.error(
          this
            .chalk`{red No repository url defined while semantic release is enabled}`
        );
        process.exit(1);
      }
      package.devDependencies.push({ "semantic-release": "^15.13.31" });
      package.devDependencies.push({
        "@semantic-release/changelog": "^3.0.6"
      });
      package.devDependencies.push({
        "@semantic-release/commit-analyzer": "^6.3.3"
      });
      package.devDependencies.push({ "@semantic-release/git": "^7.0.18" });
      package.devDependencies.push({
        "@semantic-release/release-notes-generator": "^7.3.4"
      });
      package.devDependencies.push({
        "@semantic-release/npm": "^5.3.4"
      });
      package.devDependencies.push({ commitizen: "^4.0.3" });
    }

    if (this.answers.travis) {
      if (!this.answers.repository || !this.answers.repository.trim()) {
        console.error(
          this.chalk`{red No repository url defined while travis ci is enabled}`
        );
        process.exit(1);
      }

      package.scripts.push({
        "travis-deploy-once": "travis-deploy-once"
      });
    }

    const pmRun = this.answers.pm === "yarn" ? "yarn" : "npm run";

    let eslintConfig;
    let tslintConfig;
    if (isTypescript) {
      tslintConfig = createTsLintConfig();
      package.devDependencies.push(...tslintConfig.devDependencies);
      const ext = isReact ? "tsx" : "ts";
      package.scripts.push({ lint: "tslint ./src/**/*." + ext });
    } else {
      eslintConfig = createEsLintConfig({ isReact });
      package.devDependencies.push(...eslintConfig.devDependencies);
      const ext = isReact ? "jsx" : "js";
      package.scripts.push({ lint: "eslint ./src/**/*." + ext });
    }

    const readmeContent = createREADME({
      name: package.name,
      description: package.description,
      author,
      email,
      license: package.license,
      licenseContent,
      repository: this.answers.repository,
      travis: this.answers.travis,
      semanticrelease: this.answers.semanticrelease,
      umd: this.answers.umd,
      umd_name: this.answers.umd_name,
      es: this.answers.es,
      type: this.answers.type
    });

    return {
      tsconfig: tsconfigConfig ? tsconfigConfig.tsconfig : "",
      package: serializePackage(package),
      rollup: rollupConfig.rollup,
      eslint: eslintConfig ? eslintConfig.eslint : "",
      tslint: tslintConfig ? tslintConfig.tslint : "",
      // rollupConfig: serializeRollupConfig(rollupConfig, {
      //   isTypescript,
      //   isReact
      // }),
      jestContent: createJestConfig({ isTypescript }),
      babelrc: babelConfig.babelrc,
      licenseContent,
      readmeContent,
      pmRun
    };
  },
  actions() {
    const validation = validate(
      (this.answers && this.answers.name) || this.outFolder
    );
    validation.warnings &&
      validation.warnings.forEach(warn => {
        console.warn("Warning:", warn);
      });
    validation.errors &&
      validation.errors.forEach(err => {
        console.error("Error:", err);
      });
    validation.errors && validation.errors.length && process.exit(1);

    const actions = [
      {
        type: "add",
        files: "**",
        templateDir: "templates",
        filters: {
          "__tests__/**": "tests",
          "__tests__/index_spec_ts": `type=="ts"`,
          "__tests__/index_spec_tsx": `type=="tsx"`,
          "__tests__/index_spec_js": `type=="js"`,
          "__tests__/index_spec_jsx": `type=="jsx"`,
          "src/index_ts": `type=="ts"`,
          "src/index_tsx": `type=="tsx"`,
          "src/index_js": `type=="js"`,
          "src/index_jsx": `type=="jsx"`,
          _tsconfig_json: `type=="tsx" || type=="ts"`,
          _tslint_json: `type=="tsx" || type=="ts"`,
          _eslint_json: `type=="jsx" || type=="js"`,
          jest_config_js: "tests",
          travis_yml: "travis",
          releaserc: "semanticrelease"
        }
      }
    ];

    actions.push({
      type: "move",
      patterns: {
        "src/index_tsx": "src/index.tsx",
        "src/index_ts": "src/index.ts",
        "src/index_js": "src/index.js",
        "src/index_jsx": "src/index.jsx",
        "__tests__/index_spec_tsx": "__tests__/index.spec.tsx",
        "__tests__/index_spec_ts": "__tests__/index.spec.ts",
        "__tests__/index_spec_js": "__tests__/index.spec.js",
        "__tests__/index_spec_jsx": "__tests__/index.spec.jsx",
        gitignore: ".gitignore",
        babelrc: "babel.config.js",
        travis_yml: ".travis.yml",
        jest_config_js: "jest.config.js",
        rollup_config_js: "rollup.config.js",
        releaserc: ".releaserc",
        README_md: "README.md",
        _package_json: "package.json",
        _tsconfig_json: "tsconfig.json",
        _tslint_json: "tslint.json",
        _eslint_json: ".eslintrc"
      }
    });

    return actions;
  },
  async completed() {
    const { cliOptions } = this.sao.opts;
    const silent = cliOptions.silent;
    this.gitInit();
    await this.npmInstall({ npmClient: this.answers.pm });
    if (!silent && this.answers.semanticrelease) {
      // @TODO console log
      // install semantic release cli
      let options = ["add", "semantic-release-cli"];
      if (this.answers.pm === "npm") {
        options[0] = "install";
      }
      spawn.sync(this.answers.pm, options, {
        cwd: this.outDir,
        stdio: "inherit"
      });
      // Setup semantic release
      spawn.sync("./node_modules/.bin/semantic-release-cli", ["setup"], {
        cwd: this.outDir,
        stdio: "inherit"
      });
      // Remove semantic release cli
      options[0] = "remove";
      if (this.answers.pm === "npm") {
        options[0] = "uninstall";
      }
      spawn.sync(this.answers.pm, options, {
        cwd: this.outDir,
        stdio: "inherit"
      });
    }

    if (this.answers.semanticrelease) {
      // Setup commitizen
      spawn.sync(
        "./node_modules/.bin/commitizen",
        ["init", "cz-conventional-changelog"],
        {
          cwd: this.outDir,
          stdio: "inherit"
        }
      );
    }
  }
};
