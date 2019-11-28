const formatjson = require("./formatjson");

const createEsLintConfig = ({ isReact }) => {
  const devDependencies = [
    {
      eslint: "^6.7.1",
      "babel-eslint": "^10.0.3"
    }
  ];

  if (isReact) {
    devDependencies.push({ "eslint-plugin-react": "^7.16.0" });
  }

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

  if (isReact) {
    config.extends.push("plugin:react/recommended");
    config.settings = {
      react: {
        version: "detect"
      }
    };
  }

  return {
    devDependencies,
    eslint: formatjson(config)
  };
};

module.exports = createEsLintConfig;
