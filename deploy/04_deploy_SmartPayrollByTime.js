/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-21 23:04:16
 * @Description: 
 */
const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const { ethers } = require("hardhat")
const hre = require("hardhat")
const {  
  smartPayrollByTimePath,
  smartPayrollByTimeABI} = require("../utils/config")
const fs = require("fs")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]
  //https://docs.chain.link/chainlink-automation/supported-networks/

  args =[60,"0x28F894ffe4f1CBC0E57ce3ec26c58BE88bc670F7","0x55C76828DF0ef0EB13DEA4503C8FAad51Abd00Ad",100000000]
 
  const smartPayrollByTime = await deploy("SmartPayrollByTime", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  writeFile(smartPayrollByTimePath,network.name ,smartPayrollByTime.address);
  fs.writeFileSync(smartPayrollByTimePath, JSON.stringify(smartPayrollByTime.address));
  const smartPayrollByTimeProvider = await ethers.getContract('SmartPayrollByTime');

  fs.writeFileSync(
    smartPayrollByTimeABI,
    smartPayrollByTimeProvider.interface.format(ethers.utils.FormatTypes.json)
  );


  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(smartPayrollByTime.address, args)
  }
}

module.exports.tags = ["keeperAutoSelfRegister", "all","SmartPayrollByTime"]