const formatjson = require("./formatjson");

const createEsLintConfig = () => {
  const devDependencies = [
    {
      eslint: "^6.7.1",
      "babel-eslint": "^10.0.3"
    }
  ];
  const config = {
    parser: "babel-eslint",
    extends: ["eslint:recommended"],
    env: {
      browser: true,
      node: true,
      es6: true
    },
    parserOptions: {
      sourceType: "module"
    }
  };
  return {
    devDependencies,
    eslint: formatjson(config)
  };
};

module.exports = createEsLintConfig;
