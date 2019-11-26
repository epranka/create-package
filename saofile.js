const spawn = require("cross-spawn");
const validate = require("validate-npm-package-name");
const serializePackage = require("./utils/serializePackage");
const serializeTSConfig = require("./utils/serializeTSConfig");
const serializeRollupConfig = require("./utils/serializeRollupConfig");
const createMITLicense = require("./utils/createMITLicense");
const createISCLicense = require("./utils/createISCLicense");
const createUNLICENSEDLicense = require("./utils/createUNLICENSEDLicense");
const prompts = require("./prompts");

module.exports = {
  prompts: prompts,
  templateData() {
    const author = this.answers.author;
    const email = this.answers.email;
    const year = new Date().getFullYear();

    let licenseContent = createISCLicense({ year, author, email });

    const tsconfig = {
      compilerOptions: {
        outDir: "./lib",
        target: "esnext",
        moduleResolution: "node",
        module: "esnext",
        jsx: "react",
        skipLibCheck: true,
        lib: ["dom", "es6"],
        experimentalDecorators: true,
        declaration: true,
        sourceMap: true,
        removeComments: true,
        noImplicitAny: false,
        noImplicitThis: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      },
      exclude: ["node_modules"],
      includes: ["./src"]
    };
    const package = {
      name: this.answers.name,
      description: this.answers.description,
      version: "0.0.1",
      main: "lib/index.js",
      types: "lib/index.d.ts",
      files: ["lib"],
      publishConfig: { access: "public" },
      keywords: [],
      author: "",
      contributors: [],
      repository: "",
      license: "ISC",
      scripts: [{ build: "rollup -c" }, { watch: "rollup -cw" }],
      dependencies: [],
      devDependencies: [
        { "@babel/cli": "^7.2.3" },
        { "@babel/core": "^7.3.4" },
        { "@babel/plugin-proposal-class-properties": "^7.3.4" },
        { "@babel/plugin-proposal-decorators": "^7.4.4" },
        { "@babel/plugin-proposal-object-rest-spread": "^7.3.4" },
        { "@babel/plugin-transform-typescript": "^7.3.2" },
        { "@babel/preset-env": "^7.3.4" },
        { "@babel/preset-typescript": "^7.3.3" },
        { "@types/hoist-non-react-statics": "^3.3.1" },
        { "@types/react": "^16.8.5" },
        { "@types/react-dom": "^16.8.2" },
        { lodash: "^4.17.15" },
        { tslint: "^5.13.0" },
        { "tslint-config-prettier": "^1.18.0" },
        { "tslint-react": "^3.6.0" },
        { typescript: "^3.3.3333" },
        { react: "*" },
        { "react-dom": "*" },
        { rollup: "^1.27.5" },
        { "rollup-plugin-babel-minify": "^9.1.1" },
        { "rollup-plugin-cleanup": "^3.1.1" },
        { "rollup-plugin-commonjs": "^10.1.0" },
        { "rollup-plugin-delete": "^1.1.0" },
        { "rollup-plugin-progress": "^1.1.1" },
        { "rollup-plugin-typescript2": "^0.25.2" }
      ],
      peerDependencies: [{ react: "*" }, { "react-dom": "*" }]
    };

    const rollupConfig = {
      input: "./src/index.tsx",
      output: [],
      plugins: [
        `progress({clearLines: false})`,
        `del({targets: [
          "lib/*"
        ]})`,
        `commonjs({
          namedExports: {}
        })`,
        `typescript()`,
        `minify()`,
        `cleanup()`
      ],
      external: [
        "...Object.keys(pkg.dependencies || {})",
        "...Object.keys(pkg.peerDependencies || {})"
      ]
    };

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

    if (this.answers.umd) {
      if (!this.answers.umd_name || !this.answers.umd_name.trim()) {
        console.error(
          this
            .chalk`{red No global UMD name defined while UMD module build is enabled}`
        );
        process.exit(1);
      }
      const umdOutput = `{
        file: pkg.main,
        format: "umd",
        name: "${this.answers.umd_name}",
        globals: {
          react: "React"
        }
      }`;
      rollupConfig.output.push(umdOutput);
    } else {
      const cjsOutput = `{
        file: pkg.main,
        format: "cjs"
      }`;
      rollupConfig.output.push(cjsOutput);
    }

    if (this.answers.es) {
      package.module = "lib/index.es.js";
      const esOutput = `{
        file: pkg.module,
        format: "es"
      }`;
      rollupConfig.output.push(esOutput);
    }

    if (this.answers.tests) {
      tsconfig.includes.push("./__tests__");
      package.scripts.push({ test: "jest" });
      package.devDependencies.push(
        { "@types/enzyme": "^3.10.3" },
        { "@types/jest": "^24.0.9" },
        { "@types/enzyme-adapter-react-16": "^1.0.5" },
        { "react-test-renderer": "^16.8.6" },
        { jest: "^24.1.0" },
        { enzyme: "^3.10.0" },
        { "enzyme-adapter-react-16": "^1.10.0" },
        { "ts-jest": "^24.0.0" }
      );
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

    return {
      tsconfig: serializeTSConfig(tsconfig),
      package: serializePackage(package),
      rollupConfig: serializeRollupConfig(rollupConfig),
      licenseContent,
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
        "__tests__/index_spec_tsx": "__tests__/index.spec.tsx",
        gitignore: ".gitignore",
        babelrc: ".babelrc",
        travis_yml: ".travis.yml",
        jest_config_js: "jest.config.js",
        rollup_config_js: "rollup.config.js",
        releaserc: ".releaserc",
        _package_json: "package.json",
        _tsconfig_json: "tsconfig.json",
        _tslint_json: "tslint.json"
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
