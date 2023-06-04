// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./ContractNFT.sol";
import "./interface/IContractNFTFactory.sol";
contract ContractNFTFactory is IContractNFTFactory{

  
  // employer=>employee=>contractNFT
  mapping(address=>address[]) public employerContract;
  mapping(address=>address[]) public employeeContract;


  //event list
  event CreateContractNFT(address,string);


  constructor() {}

  // font call
  function createTask(address _employeeAddress,string memory contractName) external override {
    require(msg.sender != _employeeAddress, "Do not send to yourself");
    ContractNFT contractNFT = new ContractNFT(contractName);
    emit CreateContractNFT(address(contractNFT),contractName);
    contractNFT.safeMint(msg.sender);
    employerContract[msg.sender].push(address(contractNFT));
    contractNFT.safeMint(_employeeAddress);
    employeeContract[_employeeAddress].push(address(contractNFT));
  }

  function getEmployerContracts(address _employer) public override returns(address[] memory){
    return employerContract[_employer];
  }

   function getEmployeeContracts(address _employee) public override returns(address[] memory){
    return employeeContract[_employee];
  }

}
