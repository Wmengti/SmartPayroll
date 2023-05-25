/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-25 14:13:22
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
  functionsFactoryPath} = require("../utils/config")
  const fs = require("fs")

const { ethers } = require("hardhat")
const hre = require("hardhat")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]

  args = []
  const funtionsFactory = await deploy("FuntionsFactory", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  writeFile(functionsFactoryPath,network.name ,funtionsFactory.address);
  



  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(funtionsFactory.address, args)
  }
}

module.exports.tags = ["functionsFactory", "all"]
