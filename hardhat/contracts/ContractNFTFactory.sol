// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./ContractNFT.sol";
import "./interface/IContractNFTFactory.sol";

contract ContractNFTFactory is IContractNFTFactory {
  // employer=>employee=>contractNFT
  mapping(address => address[]) public employerContract;
  mapping(address => address[]) public employeeContract;

  //event list
  event CreateContractNFT(address indexed contractNFTAddress, string contractName);

  constructor() {}

  // font call
  function createTask(address _employeeAddress, string memory contractName) external override {
    require(msg.sender != _employeeAddress && _employeeAddress != address(0), "employeeAddress is error");
    ContractNFT contractNFT = new ContractNFT(contractName);
    address contractNFTAddress = address(contractNFT);
    emit CreateContractNFT(contractNFTAddress, contractName);
    contractNFT.safeMint(msg.sender);
    employerContract[msg.sender].push(contractNFTAddress);
    contractNFT.safeMint(_employeeAddress);
    employeeContract[_employeeAddress].push(contractNFTAddress);
  }

  function getEmployerContracts(address _employer) public view override returns (address[] memory) {
    return employerContract[_employer];
  }

  function getEmployeeContracts(address _employee) public view override returns (address[] memory) {
    return employeeContract[_employee];
  }
}
