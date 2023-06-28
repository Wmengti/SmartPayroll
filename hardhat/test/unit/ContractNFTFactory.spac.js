/*
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-06-28 19:12:36
 * @Description:
 */
const { expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { network } = require("hardhat")

describe("ContractNFTFactory Unit Tests", async function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  const deployFixture = async () => {
    const [owner, user1, user2] = await ethers.getSigners()
    const contractNFTFactory = await (await ethers.getContractFactory("ContractNFTFactory", owner)).deploy()

    return { owner, user1, user2, contractNFTFactory }
  }

  describe("createTask", async function () {
    it("employee error address", async () => {
      const { contractNFTFactory, owner } = await loadFixture(deployFixture)
      await expect(contractNFTFactory.connect(owner).createTask(owner.address, "solidity")).to.be.reverted.revertedWith(
        "employeeAddress is error"
      )
      await expect(
        contractNFTFactory.connect(owner).createTask("0x0000000000000000000000000000000000000000", "solidity")
      ).to.be.reverted.revertedWith("employeeAddress is error")
    })

    it("contractNFT is successed to create", async () => {
      const { contractNFTFactory, owner, user2 } = await loadFixture(deployFixture)
      await expect(contractNFTFactory.connect(owner).createTask(user2.address, "solidity"))
        .to.be.emit(contractNFTFactory, "CreateContractNFT")
        .withArgs(anyValue, "solidity")
    })
  })

  describe("get employer and employee nft contract", () => {
    it("should return NFT contracts", async () => {
      const { contractNFTFactory, owner, user1, user2 } = await loadFixture(deployFixture)
      const tx = await contractNFTFactory.connect(owner).createTask(user2.address, "solidity")
      await tx.wait(1)
      const employerNFT = (await contractNFTFactory.getEmployerContracts(owner.address))[0]
      const employeeNFT = (await contractNFTFactory.getEmployeeContracts(user2.address))[0]
      expect(employerNFT.toLowerCase()).to.equal(employeeNFT.toLowerCase())
    })
  })
})
