const fs = require("fs");

const getRepositoryURL = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(".git/config", "utf-8", (err, gitconf) => {
      if (err) return reject(err);
      if (!gitconf) return "";
      gitconf = gitconf.split(/\r?\n/);
      var i = gitconf.indexOf('[remote "origin"]');
      if (i !== -1) {
        var u = gitconf[i + 1];
        if (!u.match(/^\s*url =/)) u = gitconf[i + 2];
        if (!u.match(/^\s*url =/)) u = null;
        else u = u.replace(/^\s*url = /, "");
      }
      if (u && u.match(/^git@github.com:/)) {
        u = u.replace(/^git@github.com:/, "https://github.com/");
      }
      if (!u) {
        return resolve("");
      }
      return resolve(u);
    });
  });
};

module.exports = getRepositoryURL;
