/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 14:20:04
 * @Description: 
 */
const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const { ethers } = require("hardhat")
const {networks,NETWORK} = require("../networks")
const hre = require("hardhat")
const {
  keeperAutoSelfRegisterPath,
  keeperAutoSelfRegisterABI,} = require("../utils/config")
const fs = require("fs")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]
  //https://docs.chain.link/chainlink-automation/supported-networks/
  args = [networks[NETWORK].linkToken,networks[NETWORK].automationRegistrar,networks[NETWORK].automationRegistry]
 
  const keeperAutoSelfRegister = await deploy("KeeperAutoSelfRegister", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  writeFile(keeperAutoSelfRegisterPath,network.name ,keeperAutoSelfRegister.address);
  
  const keeperAutoSelfRegisterProvider = await ethers.getContract('KeeperAutoSelfRegister');
  fs.writeFileSync(
    keeperAutoSelfRegisterABI,
    keeperAutoSelfRegisterProvider.interface.format(ethers.utils.FormatTypes.json)
  );
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(keeperAutoSelfRegister.address, args)
  }
}

module.exports.tags = ["keeperAutoSelfRegister", "all","firstCreate"]