const formatyaml = require("./formatyaml");

const createTravisConfig = () => {
  const scripts = [
    {
      "travis-deploy-once": "travis-deploy-once"
    }
  ];
  const config = {
    language: "node_js",
    os: "linux",
    jobs: {
      include: [
        {
          stage: "Release",
          name: "Releasing",
          node_js: "lts/*",
          deploy: {
            provider: "script",
            skip_cleanup: true,
            script: "npx semantic-release"
          }
        }
      ]
    }
  };
  return {
    scripts,
    travis: formatyaml(config)
  };
  //   return `language: node_js
  // os: linux

  // jobs:
  // include:
  //     # Define the release stage that runs semantic-release
  //     - stage: release
  //     name: "Releasing"
  //     node_js: lts/*
  //     deploy:
  //         provider: script
  //         skip_cleanup: true
  //         script: npx semantic-release
  //   `;
};

module.exports = createTravisConfig;