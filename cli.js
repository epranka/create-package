#!/usr/bin/env node
const path = require("path");
const sao = require("sao");
const cac = require("cac");
const chalk = require("chalk");
const envinfo = require("envinfo");
const { version } = require("./package.json");

const generator = path.resolve(__dirname, "./");
const cli = cac("create-tsx-package");

const showEnvInfo = async () => {
  console.log(chalk.bold("\nEnvironment Info:"));
  const result = await envinfo.run({
    System: ["OS", "CPU"],
    Binaries: ["Node", "Yarn", "npm"],
    Browsers: ["Chrome", "Edge", "Firefox", "Safari"],
    npmGlobalPackages: ["@epranka/create-tsx-package"]
  });
  console.log(result);
  process.exit(1);
};

cli
  .command("[out-dir]", "Generate in a custom directory or current directory")
  .option(
    "-i",
    "--info",
    "Print out debugging information relating to the local environment"
  )
  .option("-v", "--verbose", "Show debug logs")
  .action((outDir = ".", cliOptions) => {
    if (cliOptions.info) {
      return showEnvInfo();
    }
    console.log();
    console.log(chalk`{cyan @epranka/create-tsx-package v${version}}`);
    console.log(chalk`✨ Generating TSX package in {cyan ${outDir}}`);

    const { verbose } = cliOptions;
    const logLevel = verbose ? 4 : 2;
    sao({ generator, outDir, logLevel, cliOptions })
      .run()
      .catch(err => {
        console.trace(err);
        process.exit(1);
      });
  });

cli.help();

cli.version(version);

cli.parse();
