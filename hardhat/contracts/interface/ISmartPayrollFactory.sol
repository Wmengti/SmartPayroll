// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ISmartPayrollFactory {
  function getUpkeeperID(address _upkeepContract) external returns (uint256);
}
