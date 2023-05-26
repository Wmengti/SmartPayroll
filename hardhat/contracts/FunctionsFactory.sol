// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "./AutomatedFunctions.sol";
import "./AutomatedFunctionsConsumer.sol";
contract FuntionsFactory {
  event autoFunctionEvent(address,uint64,uint256);

  constructor (){}

  function createAutomatedFunctions(
    address oracle,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval) external{
    AutomatedFunctions autoFunction = new AutomatedFunctions(
      oracle,
      _subscriptionId,
      _fulfillGasLimit,
      _updateInterval
    );
    emit autoFunctionEvent(address(autoFunction),_subscriptionId,_updateInterval);
  }
  function createAutomatedFunctionsConsumer(
    address oracle,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval) external{
    AutomatedFunctionsConsumer autoFunction = new AutomatedFunctionsConsumer(
      oracle,
      _subscriptionId,
      _fulfillGasLimit,
      _updateInterval
    );
    emit autoFunctionEvent(address(autoFunction),_subscriptionId,_updateInterval);
  }



}