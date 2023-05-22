//SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

interface IKeeperRegistry2_0 {
  function cancelUpkeep(uint256 id) external;

  function pauseUpkeep(uint256 id) external;

  function unpauseUpkeep(uint256 id) external;
  function addFunds(uint256 id, uint96 amount) external;
  function withdrawFunds(uint256 id, address to) external ;
}