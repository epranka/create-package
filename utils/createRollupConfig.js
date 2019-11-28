const formatjs = require("./formatjs");

const getInputName = ({ isReact, isTypescript }) => {
  return isReact && isTypescript
    ? "./src/index.tsx"
    : isReact
    ? "./src/index.jsx"
    : isTypescript
    ? "./src/index.ts"
    : "./src/index.js";
};

const createRollupConfig = ({
  es,
  useTests,
  umd,
  umd_name,
  isReact,
  isTypescript
}) => {
  const devDependencies = [
    {
      rollup: "^1.27.5",
      "rollup-plugin-babel": "^4.3.3",
      "rollup-plugin-cleanup": "^3.1.1",
      "rollup-plugin-commonjs": "^10.1.0",
      "rollup-plugin-delete": "^1.1.0",
      "rollup-plugin-progress": "^1.1.1",
      "rollup-plugin-terser": "^5.1.2"
    }
  ];
  if (isTypescript) {
    devDependencies.push({ "rollup-plugin-typescript2": "^0.25.2" });
  }
  const imports = [
    `import pkg from "./package.json";`,
    `import commonjs from "rollup-plugin-commonjs";`,
    `import progress from "rollup-plugin-progress";`,
    `import babel from "rollup-plugin-babel";`,
    `import {terser} from "rollup-plugin-terser";`,
    `import cleanup from "rollup-plugin-cleanup";`,
    `import del from "rollup-plugin-delete";`
  ];
  if (isTypescript) {
    imports.push(`import typescript from "rollup-plugin-typescript2";`);
  }
  const input = getInputName({ isReact, isTypescript });
  const outputs = [];
  if (umd && umd_name) {
    outputs.push(`{
        file: pkg.main,
        format: "umd",
        name: "${umd_name}",
        globals: {${isReact ? `react: "React"` : ""}}
    }`);
  } else {
    outputs.push(`{
        file: pkg.main,
        format: "cjs"    
    }`);
  }
  if (es) {
    outputs.push(`{
        file: pkg.module,
        format: "es"
    }`);
  }
  const plugins = [
    `progress({clearLines: false})`,
    `del({targets: [
        "lib/*"
    ]})`,
    `babel({
        exclude: "node_modules/**"
    })`,
    `commonjs({
        namedExports: {}
    })`
  ];
  if (isTypescript && useTests) {
    plugins.push(`typescript({
        tsconfigOverride: {
            exclude: ["./__tests__"]
        }
    })`);
  } else if (isTypescript) {
    plugins.push(`typescript()`);
  }
  plugins.push(`terser()`);
  plugins.push(`cleanup()`);
  const rollup = `
    ${imports.join("\n")}

    export default {
        input: ${JSON.stringify(input)},
        output: [
            ${outputs.join(",\n")}
        ],
        plugins: [
            ${plugins.join(",\n")}
        ],
        external: [
            ...Object.keys(pkg.dependencies || {}),
            ...Object.keys(pkg.peerDependencies || {})
        ]
    }`;

  return {
    devDependencies,
    rollup: formatjs(rollup)
  };
};

module.exports = createRollupConfig;
