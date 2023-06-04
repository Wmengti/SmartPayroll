// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


interface IContractNFTFactory {
  function createTask(address _employeeAddress,string memory contractName) external;
  function getEmployerContracts(address _employer) external returns(address[] memory);
  function getEmployeeContracts(address _employee) external returns(address[] memory);
}