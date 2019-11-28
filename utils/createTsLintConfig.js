const formatjson = require("./formatjson");

const createTsLintConfig = () => {
  const devDependencies = [{ tslint: "^5.20.1" }];

  const config = {
    extends: ["tslint:recommended"],
    rules: {
      "no-console": false
    }
  };

  return {
    devDependencies,
    tslint: formatjson(config)
  };
};

module.exports = createTsLintConfig;
