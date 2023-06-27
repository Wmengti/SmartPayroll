// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Registration} from "../library/Registration.sol";

interface IKeeperAutoSelfRegister {
  function registerAndPredictID(Registration.RegistrationParams memory params) external returns (uint256);
}
