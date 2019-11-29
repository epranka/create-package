const formatyaml = require("./formatyaml");
const getNodeVersion = require("./getNodeVersion");

const createTravisConfig = ({ useSemanticRelease }) => {
  const nodeVersion = getNodeVersion();
  const scripts = [
    {
      "travis-deploy-once": "travis-deploy-once"
    }
  ];
  const config = {
    language: "node_js",
    os: "linux",
    node_js: [nodeVersion ? nodeVersion : "lts/*"]
  };
  if (useSemanticRelease) {
    config.jobs = {
      include: [
        {
          stage: "Release",
          name: "Releasing",
          node_js: nodeVersion ? nodeVersion : "lts/*",
          deploy: {
            provider: "script",
            skip_cleanup: true,
            script: "npx semantic-release",
            on: {
              branch: ["master", "next", "next-major", "beta", "alpha"]
            }
          }
        }
      ]
    };
  }
  return {
    scripts,
    travis: formatyaml(config)
  };
};

module.exports = createTravisConfig;
