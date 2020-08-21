const formatjson = require("./formatjson");

const createEsLintConfig = ({ isReact, isTypescript }) => {
  const devDependencies = [
    {
      eslint: "^7.7.0",
    },
  ];

  const config = {
    env: {
      browser: true,
      es2020: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaFeatures: {
        jsx: isReact,
      },
      ecmaVersion: 11,
      sourceType: "module",
    },
    plugins: [],
    ignorePatterns: ["lib/"],
  };

  if (isReact) {
    devDependencies.push({ "eslint-plugin-react": "^7.20.6" });
    config.extends.push("plugin:react/recommended");
    config.plugins.push("react");
  }

  if (isTypescript) {
    devDependencies.push({ "@typescript-eslint/eslint-plugin": "^3.9.1" });
    devDependencies.push({ "@typescript-eslint/parser": "^3.9.1" });
    config.parser = "@typescript-eslint/parser";
    config.extends.push("plugin:@typescript-eslint/recommended");
    config.plugins.push("@typescript-eslint");
  }

  return {
    devDependencies,
    eslint: formatjson(config),
  };
};

module.exports = createEsLintConfig;
