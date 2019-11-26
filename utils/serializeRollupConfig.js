const beautify = require("js-beautify").js;

const serializeRollupConfig = rollupConfig => {
  const rollupResult = `
    import typescript from "rollup-plugin-typescript2";
    import commonjs from "rollup-plugin-commonjs";
    import progress from "rollup-plugin-progress";
    import minify from "rollup-plugin-babel-minify";
    import cleanup from "rollup-plugin-cleanup";
    import del from "rollup-plugin-delete";
    import pkg from "./package.json";

    export default {
        input: ${JSON.stringify(rollupConfig.input)},
        output: [
            ${rollupConfig.output.join(",\n")}
        ],
        plugins: [
            ${rollupConfig.plugins.join(",\n")}
        ],
        external: [
            ${rollupConfig.external.join(",\n")}
        ]
    }
  `;

  const formatted = beautify(rollupResult, {
    indent_with_tabs: true,
    indent_size: 4
  });

  return formatted;
};

module.exports = serializeRollupConfig;
