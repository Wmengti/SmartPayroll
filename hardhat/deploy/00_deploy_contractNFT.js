/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-05-29 10:13:42
 * @Description: 
 */
const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const {contractNFTPath,contractNFTABI} = require("../utils/config")
const fs = require("fs")
const { ethers } = require("hardhat")
const hre = require("hardhat")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const developmentChains = ["hardhat", "localhost"]

  args = []
  const contractNFT = await deploy("ContractNFT", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  writeFile(contractNFTPath,network.name ,contractNFT.address);
  const contractNFTProvider = await ethers.getContract('ContractNFT');
  fs.writeFileSync(
    contractNFTABI,
    contractNFTProvider.interface.format(ethers.utils.FormatTypes.json)
  );

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(contractNFT.address, args)
  }
}

module.exports.tags = ["ContractNFT","firstCreate"]
