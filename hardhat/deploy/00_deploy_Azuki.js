/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-02 16:06:21
 * @Description: 
 */
const { verify} = require("../utils/verify")

const { ethers } = require("hardhat")
const hre = require("hardhat")


module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]

  args = []
  const Azuki = await deploy("Azuki", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
 
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(Azuki.address, args)
  }
}

module.exports.tags = ["Azuki"]