// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

library UpkeeperContract {

  struct contractParams {
    uint updateInterval;
    address _erc20Address;
    address _sender;
    address _receiver;
    uint256 _round;
    uint256 _amount;
    address _credit;
  }
  
}