// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IDAOVault {
  function withdrawFunds(bytes memory response) external;

  function grantRole(bytes32 role, address account) external;
}
