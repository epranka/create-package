const fs = require("fs");

const getRepositoryURL = () => {
  try {
    let gitconf = fs.readFileSync(".git/config", "utf-8");
    if (!gitconf) return "";
    gitconf = gitconf.split(/\r?\n/);
    const i = gitconf.indexOf('[remote "origin"]');
    let u;
    if (i !== -1) {
      u = gitconf[i + 1];
      if (!u.match(/^\s*url =/)) u = gitconf[i + 2];
      if (!u.match(/^\s*url =/)) u = null;
      else u = u.replace(/^\s*url = /, "");
    }
    if (u && u.match(/^git@github.com:/)) {
      u = u.replace(/^git@github.com:/, "https://github.com/");
    }
    if (!u) {
      return "";
    }
    return u;
  } catch (_) {
    return "";
  }
};

module.exports = getRepositoryURL;
