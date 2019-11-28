const yaml = require("json2yaml");

const formatyaml = jsonSource => {
  return yaml.stringify(jsonSource);
};

module.exports = formatyaml;
