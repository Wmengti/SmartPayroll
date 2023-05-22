// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SmartPayroll {
  constructor() {}

  function timeERC20Trigger(address _to, address _erc20Address, uint256 _amount) external {
    IERC20 token = IERC20(_erc20Address);
    require(token.transferFrom(msg.sender, _to, _amount), "transfer failed");
  }

  function timeETHTrigger(address _to, uint256 _amount) payable external{
    require(msg.value >= _amount, "Not enought Ether provided");
    (bool success, ) = _to.call{value: _amount}("");
    require(success, "Transfer failed.");
  }
}
