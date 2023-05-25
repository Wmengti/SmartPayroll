/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-21 19:11:49
 * @Description: 
 */
/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-18 19:35:34
 * @Description: 
 */
const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const {  
  smartPayrollFactoryPath,
  smartPayrollFactoryABI} = require("../utils/config")
  const fs = require("fs")

const { ethers } = require("hardhat")
const hre = require("hardhat")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]

  args = []
  const smartPayrollByFactory = await deploy("SmartPayrollFactory", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  writeFile(smartPayrollFactoryPath,network.name ,smartPayrollByFactory.address);
  
  const smartPayrollFactoryProvider = await ethers.getContract('SmartPayrollFactory');

  fs.writeFileSync(
    smartPayrollFactoryABI,
    smartPayrollFactoryProvider.interface.format(ethers.utils.FormatTypes.json)
  );



  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(smartPayrollByFactory.address, args)
  }
}

module.exports.tags = ["SmartPayrollFactory", "all","firstCreate"]
