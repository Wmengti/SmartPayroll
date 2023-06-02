// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "./AutomatedFunctions.sol";


contract FuntionsFactory {


  event autoFunctionEvent(address,uint64,uint256);
  event autoCounter(address,uint256);

  constructor (){}

  function createAutomatedFunctions(
    address oracle,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval,
    address _DAOAddress,
    address _factoryAddress) external{
    AutomatedFunctions autoFunction = new AutomatedFunctions(
      oracle,
      _subscriptionId,
      _fulfillGasLimit,
      _updateInterval,
      _DAOAddress,
      _factoryAddress
    );
    emit autoFunctionEvent(address(autoFunction),_subscriptionId,_updateInterval);
  }
 
}