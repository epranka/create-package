const beautify = require("js-beautify").js;

const serializeRollupConfig = (rollupConfig, { isTypescript, isReact }) => {
  const rollupResult = `${
    isTypescript
      ? `import typescript from "rollup-plugin-typescript2";`
      : isReact
      ? `import babel from "rollup-plugin-babel";`
      : ""
  };
    import commonjs from "rollup-plugin-commonjs";
    import progress from "rollup-plugin-progress";
    import {terser} from "rollup-plugin-terser";
    import cleanup from "rollup-plugin-cleanup";
    import del from "rollup-plugin-delete";
    import pkg from "./package.json";

    export default {
        input: ${JSON.stringify(rollupConfig.input)},
        output: [
            ${rollupConfig.output.filter(Boolean).join(",\n")}
        ],
        plugins: [
            ${rollupConfig.plugins.filter(Boolean).join(",\n")}
        ],
        external: [
            ${rollupConfig.external.filter(Boolean).join(",\n")}
        ]
    }
  `;

  const formatted = beautify(rollupResult, {
    indent_size: 2
  });

  return formatted;
};

module.exports = serializeRollupConfig;
