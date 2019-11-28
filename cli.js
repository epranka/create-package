#!/usr/bin/env node
const path = require("path");
const sao = require("sao");
const cac = require("cac");
const chalk = require("chalk");
const envinfo = require("envinfo");
const { version } = require("./package.json");

const generator = path.resolve(__dirname, "./");
const cli = cac("create-package");

const showEnvInfo = async () => {
  console.log(chalk.bold("\nEnvironment Info:"));
  const result = await envinfo.run({
    System: ["OS", "CPU"],
    Binaries: ["Node", "Yarn", "npm"],
    Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
    npmGlobalPackages: ["@epranka/create-package"]
  });
  console.log(result);
  process.exit(1);
};

cli
  .command("[out-dir]", "Generate in a <out-dir> or current directory")
  .option(
    "-i, --info",
    "Print out debugging information relating to the local environment"
  )
  .option(
    "-s, --silent",
    "Silent mode. Create package without user interaction"
  )
  .option("--name <name>", "Name of the package")
  .option("--description <name>", "Description of the package")
  .option("--author <fullname>", "Author of package <fullname>")
  .option("--email <email>", "<email> of author")
  .option("--npm", "Use NPM package manager. Default is YARN")
  .option("--mit", "MIT license. Default is ISC")
  .option("--umd <GlobalName>", "Build UMD module with <GlobalName>")
  .option(
    "--type <ts|tsx|js|jsx>",
    "Type of package, one of TS, TSX, JS, JSX. Default is TS"
  )
  .option("--unlicensed", "Unlicensed. This option overrides --mit option")
  .option("--travis", "Use Travis ci")
  .option("--semantic-release", "Use semantic release")
  .option("--repository <url>", "Repository URL")
  .option("--no-private", "No private:true property in package.json")
  .option("--no-es", "Don't build ES Module")
  .option("--no-tests", "Don't use tests")
  .option("--skip-semantic-release-setup", "Skip semantic release setup")
  .option("--verbose", "Show debug logs")
  .action((outDir = ".", cliOptions) => {
    if (cliOptions.info) {
      return showEnvInfo();
    }
    console.log();
    console.log(chalk`{cyan @epranka/create-package v${version}}`);
    console.log(chalk`✨ Generating package in {cyan ${outDir}}`);

    const { verbose, silent } = cliOptions;
    const logLevel = verbose ? 4 : 2;
    sao({ generator, outDir, logLevel, cliOptions, yes: silent })
      .run()
      .catch(err => {
        console.trace(err);
        process.exit(1);
      });
  });

cli.help();

cli.version(version);

global["parsedArgs"] = cli.parse();
