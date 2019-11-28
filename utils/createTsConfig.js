const formatjson = require("./formatjson");

const createTsConfig = ({ isReact, useTests }) => {
  const config = {
    compilerOptions: {
      outDir: "./lib",
      target: "esnext",
      moduleResolution: "node",
      module: "esnext",
      jsx: isReact ? "react" : undefined,
      skipLibCheck: true,
      lib: ["dom", "es6"],
      declaration: true,
      sourceMap: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true
    },
    exclude: ["node_modules"],
    includes: ["./src"]
  };

  if (useTests) {
    config.includes.push("./__tests__");
  }

  return {
    tsconfig: formatjson(config)
  };
};

module.exports = createTsConfig;
