// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ContractNFT} from "./ContractNFT.sol";
import {IContractNFTFactory} from "./interface/IContractNFTFactory.sol";

contract ContractNFTFactory is IContractNFTFactory {
  // employer=>employee=>contractNFT
  mapping(address => address[]) public employerContract;
  mapping(address => address[]) public employeeContract;

  //event list
  event CreateContractNFT(address contractNFT, string contractName);

  error IsErrorEmployeeAddress(address employeeAddress);

  constructor() {}

  // font call
  function createTask(address _employeeAddress, string memory contractName) external override {
    if (msg.sender == _employeeAddress) revert IsErrorEmployeeAddress(_employeeAddress);
    ContractNFT contractNFT = new ContractNFT(contractName);

    contractNFT.safeMint(msg.sender);
    employerContract[msg.sender].push(address(contractNFT));
    contractNFT.safeMint(_employeeAddress);
    employeeContract[_employeeAddress].push(address(contractNFT));

    emit CreateContractNFT(address(contractNFT), contractName);
  }

  function getEmployerContracts(address _employer) public view override returns (address[] memory) {
    return employerContract[_employer];
  }

  function getEmployeeContracts(address _employee) public view override returns (address[] memory) {
    return employeeContract[_employee];
  }
}
