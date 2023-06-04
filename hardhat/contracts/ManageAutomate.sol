
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


  interface IAutomationRegistryInterface {
  function withdrawFunds(uint256,address) external;
  function cancelUpkeep(uint256) external;


}

contract ManageAutomate {


  IAutomationRegistryInterface public immutable i_registry;
  constructor (address _registry) {

     i_registry = IAutomationRegistryInterface(_registry);

  }
}