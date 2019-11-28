const formatjson = require("./formatjson");

const createSemanticReleaseConfig = () => {
  const scripts = [
    {
      cz: "git-cz"
    }
  ];
  const devDependencies = [
    {
      "semantic-release": "^15.13.31",
      "@semantic-release/changelog": "^3.0.6",
      "@semantic-release/commit-analyzer": "^6.3.3",
      "@semantic-release/git": "^7.0.18",
      "@semantic-release/release-notes-generator": "^7.3.4",
      "@semantic-release/npm": "^5.3.4",
      commitizen: "^4.0.3"
    }
  ];

  const config = {
    ci: "false",
    plugins: [
      [
        "@semantic-release/commit-analyzer",
        {
          releaseRules: [
            {
              type: "docs",
              release: "patch"
            },
            {
              type: "improvement",
              release: "patch"
            },
            {
              type: "style",
              release: "patch"
            }
          ],
          parserOpts: {
            noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"]
          }
        }
      ],
      "@semantic-release/release-notes-generator",
      [
        "@semantic-release/changelog",
        {
          changelogFile: "CHANGELOG.md"
        }
      ],
      "@semantic-release/npm",
      [
        "@semantic-release/git",
        {
          assets: [
            "CHANGELOG.md",
            "package.json",
            "package-lock.json",
            "yarn-lock.json",
            "npm-shrinkwrap.json"
          ]
        }
      ]
    ]
  };

  return {
    semanticrelease: formatjson(config),
    devDependencies,
    scripts
  };
};

module.exports = createSemanticReleaseConfig;
