const beautify = require("js-beautify").js;

const createJestConfig = ({ isTypescript }) => {
  const jestConfig = `const { defaults } = require("jest-config");

  module.exports = {
    bail: true,
    moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
    roots: ["."],
    ${
      isTypescript
        ? `
        transform: {
           '^.+\\.tsx?$': 'ts-jest',
        },
    `
        : ""
    }
    
    verbose: true,
    moduleDirectories: ["node_modules", "src"]
  };
  
  `;

  return beautify(jestConfig, {
    indent_size: 2
  });
};

module.exports = createJestConfig;
