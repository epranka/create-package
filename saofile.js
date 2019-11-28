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
    const type = this.answers.type;
    const author = this.answers.author;
    const email = this.answers.email;
    const year = new Date().getFullYear();
    const es = this.answers.es;
    const useTests = this.answers.tests;
    const umd = this.answers.umd;
    const umd_name = this.answers.umd_name;
    const isTypescript = type === "tsx" || type === "ts";
    const isReact = type === "tsx" || type === "jsx";

    if (this.answers.umd) {
      if (!this.answers.umd_name || !this.answers.umd_name.trim()) {
        console.error(
          this
            .chalk`{red No global UMD name defined while UMD module build is enabled}`
        );
        process.exit(1);
      }
    }

    let licenseContent = createISCLicense({ year, author, email });

    let tsconfigConfig;
    if (isTypescript) {
      tsconfigConfig = createTsConfig({ isReact, useTests });
    }

    // const tsconfig = {
    //   compilerOptions: {
    //     outDir: "./lib",
    //     target: "esnext",
    //     moduleResolution: "node",
    //     module: "esnext",
    //     jsx: undefined,
    //     skipLibCheck: true,
    //     lib: ["dom", "es6"],
    //     declaration: true,
    //     sourceMap: true,
    //     esModuleInterop: true,
    //     allowSyntheticDefaultImports: true
    //     // experimentalDecorators: true,
    //     // removeComments: true,
    //     // noImplicitAny: false,
    //     // noImplicitThis: true,
    //     // noImplicitReturns: true,
    //     // noFallthroughCasesInSwitch: true,
    //   },
    //   exclude: ["node_modules"],
    //   includes: ["./src"]
    // };

    const package = {
      name: this.answers.name,
      description: this.answers.description,
      private: undefined,
      version: "0.0.1",
      main: "lib/index.js",
      module: undefined,
      types: undefined,
      files: ["lib"],
      publishConfig: { access: "public" },
      keywords: [],
      author: undefined,
      contributors: [],
      repository: "",
      license: "ISC",
      scripts: [{ build: "rollup -c" }, { watch: "rollup -cw" }],
      dependencies: [],
      devDependencies: [
        // { "@babel/cli": "^7.2.3" },
        // { "@babel/core": "^7.3.4" },
        // { "@babel/plugin-proposal-class-properties": "^7.3.4" },
        // { "@babel/plugin-proposal-decorators": "^7.4.4" },
        // { "@babel/plugin-proposal-object-rest-spread": "^7.3.4" },
        // { "@babel/preset-env": "^7.3.4" },
        // { lodash: "^4.17.15" }
        // { rollup: "^1.27.5" },
        // { "rollup-plugin-terser": "^5.1.2" },
        // { "rollup-plugin-cleanup": "^3.1.1" },
        // { "rollup-plugin-commonjs": "^10.1.0" },
        // { "rollup-plugin-delete": "^1.1.0" },
        // { "rollup-plugin-progress": "^1.1.1" }
      ],
      peerDependencies: []
    };

    // const babelrc = {
    //   presets: ["@babel/env"],
    //   plugins: [
    //     ["@babel/plugin-proposal-decorators", { legacy: true }],
    //     "@babel/proposal-class-properties",
    //     "@babel/proposal-object-rest-spread"
    //   ]
    // };

    const authorObject = [];
    if (author) {
      authorObject.push(author);
      if (email) authorObject.push(`<${email}>`);
    }
    if (authorObject.length) {
      package.author = authorObject.join(" ");
      package.contributors.push(authorObject.join(" "));
    }

    // const rollupConfig = {
    //   input: undefined,
    //   output: [],
    //   plugins: [
    //     `progress({clearLines: false})`,
    //     `del({targets: [
    //       "lib/*"
    //     ]})`,
    //     `commonjs({
    //       namedExports: {}
    //     })`,
    //     isTypescript
    //       ? this.answers.tests
    //         ? `typescript({
    //       tsconfigOverride: {
    //         exclude: ["./__tests__"]
    //       }
    //     })`
    //         : `typescript()`
    //       : isReact
    //       ? `babel({exclude: "node_modules/**"})`
    //       : null,
    //     `terser()`,
    //     `cleanup()`
    //   ],
    //   external: [
    //     "...Object.keys(pkg.dependencies || {})",
    //     "...Object.keys(pkg.peerDependencies || {})"
    //   ]
    // };

    const rollupConfig = createRollupConfig({
      es,
      useTests,
      umd,
      umd_name,
      isReact,
      isTypescript
    });
    package.devDependencies.push(...rollupConfig.devDependencies);

    if (cliOptions.private) {
      package.private = true;
    }

    const babelRcConfig = createBabelConfig({ isReact });
    package.devDependencies.push(...babelRcConfig.devDependencies);

    if (isTypescript) {
      package.devDependencies.push(
        // { "@babel/plugin-transform-typescript": "^7.3.2" },
        // { "@babel/preset-typescript": "^7.3.3" },
        // { tslint: "^5.13.0" },
        { typescript: "^3.3.3333" }
        // { "rollup-plugin-typescript2": "^0.25.2" }
      );
      package.types = "lib/index.d.ts";
      // babelrc.presets.unshift("@babel/typescript");
      // babelrc.plugins.push("@babel/plugin-transform-typescript");
    } else {
      package.devDependencies.push({ eslint: "^6.7.1" });
    }

    if (this.answers.type === "tsx") {
      // tsconfig.compilerOptions.jsx = "react";
      // rollupConfig.input = "./src/index.tsx";
      package.devDependencies.push(
        { "@types/hoist-non-react-statics": "^3.3.1" },
        { "@types/react": "^16.8.5" },
        { "@types/react-dom": "^16.8.2" },
        { react: "*" },
        { "react-dom": "*" }
        // { "tslint-react": "^3.6.0" }
      );
      package.peerDependencies.push({ react: "*" }, { "react-dom": "*" });
    } else if (this.answers.type === "ts") {
      // rollupConfig.input = "./src/index.ts";
    } else if (this.answers.type === "jsx") {
      // rollupConfig.input = "./src/index.jsx";
      package.devDependencies.push(
        // { "@babel/preset-react": "^7.7.4" },
        { "rollup-plugin-babel": "^4.3.3" },
        { react: "*" },
        { "react-dom": "*" }
      );
      package.peerDependencies.push({ react: "*" }, { "react-dom": "*" });
      // babelrc.presets.push("@babel/preset-react");
    } else if (this.answers.type === "js") {
      // rollupConfig.input = "./src/index.js";
    }

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

    // if (this.answers.umd) {
    //   if (!this.answers.umd_name || !this.answers.umd_name.trim()) {
    //     console.error(
    //       this
    //         .chalk`{red No global UMD name defined while UMD module build is enabled}`
    //     );
    //     process.exit(1);
    //   }
    //   const umdOutput = `{
    //     file: pkg.main,
    //     format: "umd",
    //     name: "${this.answers.umd_name}",
    //     globals: {
    //       ${
    //         this.answers.type === "tsx" || this.answers.type === "jsx"
    //           ? `react: "React"`
    //           : ""
    //       }
    //     }
    //   }`;
    //   rollupConfig.output.push(umdOutput);
    // } else {
    //   const cjsOutput = `{
    //     file: pkg.main,
    //     format: "cjs"
    //   }`;
    //   rollupConfig.output.push(cjsOutput);
    // }

    if (this.answers.es) {
      package.module = "lib/index.es.js";
      // const esOutput = `{
      //   file: pkg.module,
      //   format: "es"
      // }`;
      // rollupConfig.output.push(esOutput);
    }

    if (this.answers.tests) {
      // tsconfig.includes.push("./__tests__");
      package.scripts.push({ test: "jest" });
      package.devDependencies.push({ jest: "^24.1.0" });
      if (this.answers.type === "ts") {
        package.devDependencies.push(
          { "@types/jest": "^24.0.9" },
          { "ts-jest": "^24.0.0" }
        );
      }
      if (this.answers.type === "tsx") {
        package.devDependencies.push(
          { "@types/jest": "^24.0.9" },
          { "ts-jest": "^24.0.0" },
          { "@types/enzyme": "^3.10.3" },
          { enzyme: "^3.10.0" },
          { "@types/enzyme-adapter-react-16": "^1.0.5" },
          { "react-test-renderer": "^16.8.6" },
          { "enzyme-adapter-react-16": "^1.10.0" }
        );
      }
      if (this.answers.type === "jsx") {
        package.devDependencies.push(
          { enzyme: "^3.10.0" },
          { "react-test-renderer": "^16.8.6" },
          { "enzyme-adapter-react-16": "^1.10.0" }
        );
      }
    } else {
      package.scripts.push({
        test: 'echo \\"Warn: No test specified\\" && exit 0"'
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

    if (this.answers.repository) {
      package.repository = {
        url: this.answers.repository
      };
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
      eslintConfig = createEsLintConfig();
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
      babelrc: babelRcConfig.babelrc,
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
