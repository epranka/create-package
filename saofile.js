const spawn = require("cross-spawn");
const validate = require("validate-npm-package-name");
const serializePackage = require("./utils/serializePackage");
const createRollupConfig = require("./utils/createRollupConfig");
const createTsConfig = require("./utils/createTsConfig");
const createEsLintConfig = require("./utils/createEsLintConfig");
const createTsLintConfig = require("./utils/createTsLintConfig");
const createREADME = require("./utils/createREADME");
const createLicenseConfig = require("./utils/createLicenseConfig");
const createJestConfig = require("./utils/createJestConfig");
const createBabelConfig = require("./utils/createBabelConfig");
const createSemanticReleaseConfig = require("./utils/createSemanticReleaseConfig");
const createTravisConfig = require("./utils/createTravisConfig");
const spinner = require("./utils/spinner");
const createProcess = require("./utils/createProcess");
const prompts = require("./prompts");

module.exports = {
  prompts: prompts,
  templateData() {
    const { cliOptions } = this.sao.opts;
    const name = this.answers.name;
    const description = this.answers.description;
    const license = this.answers.license;
    const type = this.answers.type;
    const author = this.answers.author;
    const email = this.answers.email;
    const year = new Date().getFullYear();
    const useEs = this.answers.useEs;
    const useTests = this.answers.useTests;
    const useSemanticRelease = this.answers.useSemanticRelease;
    const useTravis = this.answers.useTravis;
    const repository = this.answers.repository;
    const useUMD = this.answers.useUMD;
    const umdName = this.answers.umdName;
    const pm = this.answers.pm;
    const isTypescript = type === "tsx" || type === "ts";
    const isReact = type === "tsx" || type === "jsx";

    if (!["ts", "tsx", "js", "jsx"].includes(type)) {
      console.error(
        this
          .chalk`{red No type ${type} is supported. Supported: js, jsx, ts, tsx}`
      );
      process.exit(1);
    }

    if (useUMD) {
      if (!umdName || !umdName.trim()) {
        console.error(
          this
            .chalk`{red No global UMD name defined while UMD module build is enabled}`
        );
        process.exit(1);
      }
    }

    if (useSemanticRelease) {
      if (!repository || !repository.trim()) {
        console.error(
          this
            .chalk`{red No repository url defined while semantic release is enabled}`
        );
        process.exit(1);
      }
    }

    if (useTravis) {
      if (!repository || !repository.trim()) {
        console.error(
          this.chalk`{red No repository url defined while travis ci is enabled}`
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
      module: useEs ? "lib/index.es.js" : undefined,
      types: isTypescript ? "lib/index.d.ts" : undefined,
      files: ["lib"],
      publishConfig: { access: "public" },
      keywords: [],
      author: undefined,
      contributors: [],
      repository: repository
        ? {
            url: repository
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

    let travisConfig;
    if (useTravis) {
      travisConfig = createTravisConfig({ useSemanticRelease });
      package.scripts.push(...travisConfig.scripts);
    }

    const rollupConfig = createRollupConfig({
      es: useEs,
      useTests,
      umd: useUMD,
      umd_name: umdName,
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

    const licenseConfig = createLicenseConfig({ license, year, author, email });
    package.license = licenseConfig.license;

    const semanticReleaseConfig = createSemanticReleaseConfig();
    package.devDependencies.push(...semanticReleaseConfig.devDependencies);
    package.scripts.push(...semanticReleaseConfig.scripts);

    const pmRun = pm === "yarn" ? "yarn" : "npm run";

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
      name,
      description,
      author,
      email,
      type,
      license: licenseConfig.license,
      licenseContent: licenseConfig.licenseContent,
      repository: repository,
      useTravis,
      useSemanticRelease,
      useUMD,
      umdName,
      useEs
    });

    return {
      tsconfig: tsconfigConfig ? tsconfigConfig.tsconfig : "",
      package: serializePackage(package),
      rollup: rollupConfig.rollup,
      eslint: eslintConfig ? eslintConfig.eslint : "",
      tslint: tslintConfig ? tslintConfig.tslint : "",
      travis: travisConfig ? travisConfig.travis : "",
      jestContent: createJestConfig({ isTypescript }),
      babelrc: babelConfig.babelrc,
      licenseContent: licenseConfig.licenseContent,
      semanticrelease: semanticReleaseConfig.semanticrelease,
      readmeContent,
      pmRun
    };
  },
  actions() {
    const name = this.answers && this.answers.name;
    const validation = validate(name || this.outFolder);
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
          "__tests__/**": "useTests",
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
          jest_config_js: "useTests",
          travis_yml: "useTravis",
          releaserc: "useSemanticRelease"
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
    const isSilentMode = cliOptions.silent;
    const useSemanticRelease = this.answers.useSemanticRelease;
    const skipSemanticReleaseSetup = cliOptions.skipSemanticReleaseSetup;
    const pm = this.answers.pm;

    await spinner(this.gitInit(), {
      startMessage: "Initializing git...",
      endMessage: "Initialized git",
      failMessage: "Failed to initialize git"
    });
    await spinner(createProcess(pm, ["install"], { cwd: this.outDir }), {
      startMessage: "Installing packages with " + pm + "...",
      endMessage: "Package installed with " + pm,
      failMessage: "Failed to install packages with " + pm
    });
    if (!skipSemanticReleaseSetup && !isSilentMode && useSemanticRelease) {
      await spinner(
        createProcess(
          pm,
          [pm === "npm" ? "install" : "add", "semantic-release-cli"],
          { cwd: this.outDir }
        ),
        {
          startMessage: "Installing semantic-release-cli...",
          endMessage: "Installed semantic-release-cli",
          failMessage: "Failed to install semantic-release-cli"
        }
      );
      console.log("✓ Prepared semantic release for setup");
      spawn.sync("./node_modules/.bin/semantic-release-cli", ["setup"], {
        cwd: this.outDir,
        stdio: "inherit"
      });
      await spinner(
        createProcess(
          pm,
          [pm === "npm" ? "uninstall" : "remove", "semantic-release-cli"],
          { cwd: this.outDir }
        ),
        {
          startMessage: "Removing semantic-release-cli",
          endMessage: "Removed semantic-release-cli",
          failMessage: "Failed to remove semantic-release-cli"
        }
      );
    }

    if (!skipSemanticReleaseSetup && !isSilentMode && useSemanticRelease) {
      await spinner(
        createProcess(
          "./node_modules/.bin/commitizen",
          ["init", "cz-conventional-changelog"],
          { cwd: this.outDir }
        ),
        {
          startMessage:
            "Initializing commitizen (this may take a bit longer)...",
          endMessage: "Initialized commitizen",
          failMessage: "Failed to initiate commitizen"
        }
      );
    }
  }
};
