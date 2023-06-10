// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;



interface IKeeperRegistrar {
  function register(
    string memory name,
    bytes calldata encryptedEmail,
    address upkeepContract,
    uint32 gasLimit,
    address adminAddress,
    bytes calldata checkData,
    bytes calldata offchainConfig,
    uint96 amount,
    address sender
  ) external;
}