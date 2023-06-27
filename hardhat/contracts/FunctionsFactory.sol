// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import {AutomatedFunctions} from "./AutomatedFunctions.sol";
import {IDAOVault} from "./interface/IDAOVault.sol";

contract FuntionsFactory {
  bytes32 public constant FUNDS_ROLE = keccak256("FUNDS_ROLE");

  mapping(address => address) public DAOToFunctions;

  event autoFunctionEvent(address autoFunction, uint64 subscriptionId, uint256 updateInterval);

  constructor() {}

  function createAutomatedFunctions(
    address oracle,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval,
    address _DAOAddress,
    address _factoryAddress
  ) external {
    AutomatedFunctions autoFunction = new AutomatedFunctions(
      oracle,
      _subscriptionId,
      _fulfillGasLimit,
      _updateInterval,
      _DAOAddress,
      _factoryAddress
    );
    DAOToFunctions[_DAOAddress] = address(autoFunction);
    IDAOVault(_DAOAddress).grantRole(FUNDS_ROLE, address(autoFunction));
    emit autoFunctionEvent(address(autoFunction), _subscriptionId, _updateInterval);
  }

  function getAutoFunctionAddress(address _DAOAddress) public view returns (address autoFunctionAddress) {
    return DAOToFunctions[_DAOAddress];
  }
}
