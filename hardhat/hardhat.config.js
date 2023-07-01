require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("./tasks");
require("hardhat-deploy");
require("@chainlink/env-enc").config();
const { networks } = require("./networks");

// Enable gas reporting (optional)
const REPORT_GAS = process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false;
const COINMARKETCAP = process.env.COINMARKETCAP;

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.6",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.7.0",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.6.6",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.4.24",
        settings: SOLC_SETTINGS,
      },
    ],
  },
  networks: {
    // hardhat: {
    //   allowUnlimitedContractSize: true,
    //   accounts: process.env.PRIVATE_KEY
    //     ? [
    //         {
    //           privateKey: process.env.PRIVATE_KEY,
    //           balance: "10000000000000000000000",
    //         },
    //       ]
    //     : [],
    // },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    goerli: {
      chainId: 5,
      accounts: [process.env.PRIVATE_KEY],
      url: process.env.GOERLI_RPC_URL,
      blockConfirmations: 6,
    },

    ...networks,
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    // to get exact network names: npx hardhat verify --list-networks
    apiKey: {
      sepolia: networks.ethereumSepolia.verifyApiKey,
      polygonMumbai: networks.polygonMumbai.verifyApiKey,
      avalancheFujiTestnet: networks.avalancheFuji.verifyApiKey,
      goerli: process.env.ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    // outputFile: "gas-report.txt",
    coinmarketcap: COINMARKETCAP,
    noColors: true,
  },
  contractSizer: {
    runOnCompile: true,
    only: [
      "AutomatedFunctions",
      "ContractNFT",
      "ContractNFTFactory",
      "CreditToken",
      "DAOVault",
      "FuntionsFactory",
      "KeeperAutoSelfRegister",
      "SmartPayrollByTime",
      "SmartPayrollFactory",
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
};
