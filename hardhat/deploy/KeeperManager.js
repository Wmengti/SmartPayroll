const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const { ethers } = require("hardhat")
const hre = require("hardhat")
const {  
  keeperManagerPath,
  keeperManagerABI} = require("../utils/config")
const fs= require("fs")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]
  //https://docs.chain.link/chainlink-automation/supported-networks/

  args =['0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2','0x326C977E6efc84E512bB9C30f76E30c160eD06FB']
  // args =['0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2']
 
  const keeperManager = await deploy("KeeperManager", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  fs.writeFileSync(keeperManagerPath, JSON.stringify(keeperManager.address));
  const keeperManagerProvider = await ethers.getContract('KeeperManager');
  fs.writeFileSync(
    keeperManagerABI,
    keeperManagerProvider.interface.format(ethers.utils.FormatTypes.json)
  );
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(keeperManager.address, args)
  }
}

module.exports.tags = ["keeperManager"]