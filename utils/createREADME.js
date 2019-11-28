const gitUrlParse = require("git-url-parse");

const createBadges = ({
  name,
  license,
  type,
  travis: useTravis,
  repository,
  semanticrelease: useSemanticRelease,
  es: useEs,
  umd: useUMD
}) => {
  const badges = [];
  const licenseBadge = `<a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/badge/license-${license}-blue.svg" />
  </a>`;
  const typescriptBadge = `<a href="https://www.typescriptlang.org/">
    <img alt="typescript version" src="https://img.shields.io/npm/dependency-version/${name}/dev/typescript.svg" />
  </a>
  `;
  const npmVersion = `<a href="https://www.npmjs.com/package/${name}">
    <img alt="npm version" src="https://img.shields.io/npm/v/${name}.svg?style=flat" />
  </a>`;
  const npmDownloads = `<a href="https://www.npmjs.com/package/${name}">
    <img alt="npm downloads" src="https://img.shields.io/npm/dt/${name}.svg?style=flat" />
  </a>`;
  badges.push(licenseBadge);
  if (useUMD) {
    const umdBadge = `<a href="https://github.com/umdjs/umd">
      <img alt="umd module" src="https://img.shields.io/badge/module-UMD-blue" />
    </a>`;
    badges.push(umdBadge);
  } else {
    const cjsBadge = `<a href="https://requirejs.org/docs/commonjs.html">
      <img alt="commonjs module" src="https://img.shields.io/badge/module-CommonJS-blue" />
    </a>`;
    badges.push(cjsBadge);
  }
  if (useEs) {
    const esBadge = `<a href="https://nodejs.org/api/esm.html">
      <img alt="es module" src="https://img.shields.io/badge/module-ESM-blue" />
    </a>`;
    badges.push(esBadge);
  }
  if (type === "tsx" || type === "ts") {
    badges.push(typescriptBadge);
  }
  badges.push(npmVersion, npmDownloads);
  if (useTravis && repository) {
    const gitUrl = gitUrlParse(repository);
    const travisBadge = `<a href="https://travis-ci.org/${gitUrl.full_name}">
      <img alt="ci travis" src="https://img.shields.io/badge/ci-travis-yellow" />
    </a>`;
    const buildBadge = `<a href="https://travis-ci.org/${gitUrl.full_name}">
      <img alt="build status" src="https://travis-ci.org/${gitUrl.full_name}.svg?branch=master" />
    </a>`;
    badges.push(buildBadge, travisBadge);
  }
  if (useSemanticRelease) {
    const semanticReleaseBadge = `<a href="https://github.com/semantic-release/semantic-release">
      <img alt="semantic release" src="https://img.shields.io/badge/%E2%9C%A8-semantic--release-e10079" />
    </a>`;
    badges.push(semanticReleaseBadge);
  }
  const generatedWith = `<a href="https://github.com/epranka/create-package">
    <img alt="generated with" src="https://img.shields.io/badge/generated%20with-%40epranka%2Fcreate--package-blue" />
  </a>`;
  badges.push(generatedWith);
  if (badges.length) {
    return [
      `<p align="center">
        ${badges.join(" ")}
    </p>`
    ];
  }
  return [];
};

const createREADME = ({
  name,
  description,
  author,
  email,
  license,
  licenseContent,
  repository,
  useTravis,
  useSemanticRelease,
  useEs,
  useUMD,
  umdName,
  type
}) => {
  const nameBlock = [];
  const descriptionBlock = [];
  nameBlock.push(
    `<h1 align="center" style="border-bottom: none;">⚒️ ${
      useUMD ? umdName : name
    }</h1>`
  );
  if (description) {
    descriptionBlock.push(`<h3 align="center">${description}</h3>`);
  }
  const badgesBlock = createBadges({
    name,
    type,
    repository,
    license,
    useSemanticRelease,
    useTravis,
    useEs,
    useUMD
  });

  const readme = [];

  readme.push(nameBlock.join(" "));
  readme.push(descriptionBlock.join(" "));
  readme.push(badgesBlock.join(" "));
  readme.push(`## Install
\`\`\`
npm install --save ${name}
\`\`\`

or

\`\`\`
yarn install ${name}
\`\`\`
  `);

  readme.push(`## Import module
Comming soon
  `);

  readme.push(`## Usage
Comming soon
  `);

  readme.push(`## Build
\`\`\`
npm run build // for single build

npm run watch // to watch changes
\`\`\`

or

\`\`\`
yarn build // for single build

yarn watch // to watch changes
\`\`\`
  `);

  const authorBlock = [];
  if (author) {
    authorBlock.push(author);
  }
  if (email) {
    authorBlock.push(`[${email}](mailto:${email})`);
  }

  if (authorBlock.length) {
    authorBlock.unshift("## Author");
  }

  readme.push(authorBlock.join("\n\n"));

  readme.push(`## License
${licenseContent}
  `);

  return readme.join("\n\n");
};

module.exports = createREADME;
