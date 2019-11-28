const formatjs = require("./formatjs");

const createBabelConfig = ({ isReact }) => {
  // Dependencies
  const devDependencies = [];
  devDependencies.push({
    "@babel/core": "^7.7.4",
    "@babel/preset-env": "^7.7.4"
  });

  if (isReact) {
    devDependencies.push({
      "@babel/preset-react": "^7.7.4"
    });
  }

  // Config file
  const presets = [`@babel/env`];
  if (isReact) {
    presets.push(`@babel/react`);
  }
  const babelrc = `module.exports = {
      presets: [${presets.map(p => JSON.stringify(p)).join(",")}]
  }`;

  return {
    devDependencies,
    babelrc: formatjs(babelrc)
  };
};

module.exports = createBabelConfig;
