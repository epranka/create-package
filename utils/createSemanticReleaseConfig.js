const formatjson = require("./formatjson");

const createSemanticReleaseConfig = () => {
  const scripts = [
    {
      cz: "git-cz"
    }
  ];
  const devDependencies = [
    {
      "semantic-release": "^16.0.0-beta.38",
      "@semantic-release/changelog": "^3.0.6",
      "@semantic-release/commit-analyzer": "^7.0.0-beta.6",
      "@semantic-release/git": "^7.1.0-beta.9",
      "@semantic-release/release-notes-generator": "^7.3.5",
      "@semantic-release/npm": "^6.0.0-beta.5",
      commitizen: "^4.0.3"
    }
  ];

  const config = {
    ci: "false",
    branches: [
      "+([0-9])?(.{+([0-9]),x}).x",
      "master",
      "next",
      "next-major",
      {
        name: "beta",
        prerelease: true
      },
      {
        name: "alpha",
        prerelease: true
      }
    ],
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
