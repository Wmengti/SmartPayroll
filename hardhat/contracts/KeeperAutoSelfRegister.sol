// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

// UpkeepIDConsumerExample.sol imports functions from both ./AutomationRegistryInterface2_0.sol and
// ./interfaces/LinkTokenInterface.sol

import {AutomationRegistryInterface, State, OnchainConfig} from "@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface2_0.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {IKeeperRegistrar} from "./interface/IKeeperRegistrar.sol";

import {Registration} from "./library/Registration.sol";

contract KeeperAutoSelfRegister {
  LinkTokenInterface public immutable i_link;
  address public immutable i_registrar;
  AutomationRegistryInterface public immutable i_registry;
  bytes4 public registerSig = IKeeperRegistrar.register.selector;

  constructor(LinkTokenInterface _link, address _registrar, AutomationRegistryInterface _registry) {
    i_link = _link;
    i_registrar = _registrar;
    i_registry = _registry;
  }

  function registerAndPredictID(Registration.RegistrationParams memory params) public returns (uint256 upkeepID) {
    (State memory state, , , , ) = i_registry.getState();
    uint256 oldNonce = state.nonce;
    bytes memory payload = abi.encode(
      params.name,
      params.encryptedEmail,
      params.upkeepContract,
      params.gasLimit,
      params.adminAddress,
      params.checkData,
      params.offchainConfig,
      params.amount,
      address(this)
    );

    i_link.transferAndCall(i_registrar, params.amount, bytes.concat(registerSig, payload));
    (state, , , , ) = i_registry.getState();
    uint256 newNonce = state.nonce;
    if (newNonce == oldNonce + 1) {
      upkeepID = uint256(
        keccak256(abi.encodePacked(blockhash(block.number - 1), address(i_registry), uint32(oldNonce)))
      );
      // DEV - Use the upkeepID however you see fit
    } else {
      revert("auto-approve disabled");
    }
  }

  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
