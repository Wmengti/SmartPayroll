const { verify} = require("../utils/verify")
const { writeFile} = require("../utils/writeFile")
const { ethers } = require("hardhat")
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
  //sepolia
  // args =['0x779877A7B0D9E8603169DdbD7836e478b4624789','0x9a811502d843E5a03913d5A2cfb646c11463467A','0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2']
  //goerli,mumbai
  args = ['0x326C977E6efc84E512bB9C30f76E30c160eD06FB','0x57A4a13b35d25EE78e084168aBaC5ad360252467','0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2']
 
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