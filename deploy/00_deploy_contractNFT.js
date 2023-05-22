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

  args = ["0x55C76828DF0ef0EB13DEA4503C8FAad51Abd00Ad"]
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

module.exports.tags = ["ContractNFT", "all","firstCreate"]
