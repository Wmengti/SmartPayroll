// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface ICreditToken {
  function mint(address to, uint256 amount) external;
}
