const beautify = require("js-beautify").js;

const formatjs = source => {
  return beautify(source, {
    indent_size: 2
  });
};

module.exports = formatjs;
