// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ISmartPayrollFactory {
  function creditMint(address _creditAddress,address _employer,address _employee) external;
  function getUpkeeperID(address _upkeepContract) external returns(uint256);
  function withdrawDAOVault(bytes memory response,address _DAOAddress) external;
}