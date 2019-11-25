const { join, relative } = require("path");
const glob = require("glob");
const spawn = require("cross-spawn");
const validate = require("validate-npm-package-name");

const rootDir = __dirname;

module.exports = {
  prompts: require("./prompts"),
  templateData() {
    const tsconfig = {
      includes: ['\t\t"./src"']
    };
    const scripts = [
      '\t\t"build": "rm -rf ./lib/** && tsc"',
      '\t\t"watch": "tsc -- --watch"'
    ];
    if (this.answers.tests) {
      tsconfig.includes.push('\t\t"./__tests__"');
      scripts.push('\t\t"test": "jest"');
    } else {
      scripts.push(
        '\t\t"test": "echo \\"Warn: No test specified\\" && exit 0"'
      );
    }
    if (this.answers.semanticrelease) {
      scripts.push(
        '\t\t"semantic-release": "semantic-release"',
        '\t\t"travis-deploy-once": "travis-deploy-once"',
        '\t\t"cz": "git-cz"'
      );
    }

    const devDependencies = [
      '\t\t"@babel/cli": "^7.2.3"',
      '\t\t"@babel/core": "^7.3.4"',
      '\t\t"@babel/plugin-proposal-class-properties": "^7.3.4"',
      '\t\t"@babel/plugin-proposal-decorators": "^7.4.4"',
      '\t\t"@babel/plugin-proposal-object-rest-spread": "^7.3.4"',
      '\t\t"@babel/plugin-transform-typescript": "^7.3.2"',
      '\t\t"@babel/preset-env": "^7.3.4"',
      '\t\t"@babel/preset-typescript": "^7.3.3"',
      '\t\t"@types/hoist-non-react-statics": "^3.3.1"',
      '\t\t"@types/react": "^16.8.5"',
      '\t\t"@types/react-dom": "^16.8.2"',
      '\t\t"lodash": "^4.17.15"',
      '\t\t"tslint": "^5.13.0"',
      '\t\t"tslint-config-prettier": "^1.18.0"',
      '\t\t"tslint-react": "^3.6.0"',
      '\t\t"typescript": "^3.3.3333"',
      '\t\t"react": "*"',
      '\t\t"react-dom": "*"'
    ];

    const peerDependencies = ['\t\t"react": "*"', '\t\t"react-dom": "*"'];

    const dependencies = [];

    if (this.answers.tests) {
      devDependencies.push(
        '\t\t"@types/enzyme": "^3.10.3"',
        '\t\t"@types/jest": "^24.0.9"',
        '\t\t"@types/enzyme-adapter-react-16": "^1.0.5"',
        '\t\t"react-test-renderer": "^16.8.6"',
        '\t\t"jest": "^24.1.0"',
        '\t\t"enzyme": "^3.10.0"',
        '\t\t"enzyme-adapter-react-16": "^1.10.0"',
        '\t\t"ts-jest": "^24.0.0"'
      );
    }

    if (this.answers.semanticrelease) {
      if (!this.answers.repository || !this.answers.repository.trim()) {
        console.error(
          this
            .chalk`{red No repository url defined while semantic release is enabled}`
        );
        process.exit(1);
      }
      devDependencies.push('\t\t"semantic-release": "^15.13.31"');
      devDependencies.push('\t\t"@semantic-release/changelog": "^3.0.6"');
      devDependencies.push('\t\t"@semantic-release/commit-analyzer": "^6.3.3"');
      devDependencies.push('\t\t"@semantic-release/git": "^7.0.18"');
      devDependencies.push(
        '\t\t"@semantic-release/release-notes-generator": "^7.3.4"'
      );
      devDependencies.push('\t\t"commitizen": "^4.0.3"');
    }

    const pmRun = this.answers.pm === "yarn" ? "yarn" : "npm run";

    return {
      tsconfig: {
        includes: tsconfig.includes.join(",\n")
      },
      scripts: scripts.join(",\n"),
      devDependencies: devDependencies.join(",\n"),
      peerDependencies: peerDependencies.join(",\n"),
      dependencies: dependencies.join(",\n"),
      pmRun
    };
  },
  actions() {
    const validation = validate(this.answers.name);
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
          travis_yml: "semanticrelease",
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
        releaserc: ".releaserc",
        _package_json: "package.json",
        _tsconfig_json: "tsconfig.json",
        _tslint_json: "tslint.json"
      }
    });

    return actions;
  },
  async completed() {
    this.gitInit();
    await this.npmInstall({ npmClient: this.answers.pm });
    if (this.answers.semanticrelease) {
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
