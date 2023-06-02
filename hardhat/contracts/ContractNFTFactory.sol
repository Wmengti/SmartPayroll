// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./ContractNFT.sol";
contract ContractNFTFactory {

  event CreateContractNFT(address,string);


  constructor() {}

  function createTask(address _employeeAddress,string memory contractName) external {
    require(msg.sender != _employeeAddress, "Do not send to yourself");
    ContractNFT contractNFT = new ContractNFT(_employeeAddress,contractName);
    emit CreateContractNFT(address(contractNFT),contractName);
    contractNFT.safeMint(msg.sender);
    contractNFT.safeMint(_employeeAddress);
  }




 
}
