const { verify } = require("../utils/verify")
const { writeFile } = require("../utils/writeFile")
const { ethers } = require("hardhat")
const { creditTokenPath, creditTokenABI } = require("../utils/config")
const fs = require("fs")
const hre = require("hardhat")
const { networks, NETWORK } = require("../networks")
const factoryAddress = require("../../salaryFrontend/constants/smartPayrollFactoryAddress.json")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]

  args = [factoryAddress[NETWORK]]
  const creditToken = await deploy("CreditToken", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  writeFile(creditTokenPath, network.name, creditToken.address)
  const creditTokenProvider = await ethers.getContract("CreditToken")
  fs.writeFileSync(creditTokenABI, creditTokenProvider.interface.format(ethers.utils.FormatTypes.json))

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(creditToken.address, args)
  }
}

module.exports.tags = ["CreditToken", "all"]
