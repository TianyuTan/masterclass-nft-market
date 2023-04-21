require("@nomiclabs/hardhat-waffle");

const INFURA_API_KEY = "571005e03676463ea1631d08fff9d518";

module.exports = {
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x2d622523edc544a240c2f08ec4875f7c6977041ac94d5e8573166ce6cc23ed61`]
    }
  },

  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};

