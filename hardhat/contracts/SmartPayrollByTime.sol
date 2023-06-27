// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol

import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ISmartPayrollFactory} from "./interface/ISmartPayrollFactory.sol";
import {ICreditToken} from "./interface/ICreditToken.sol";

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {UpkeeperContract} from "./library/UpkeeperContract.sol";

contract SmartPayrollByTime is AutomationCompatible {
  using SafeERC20 for IERC20;
  /**
   * Public counter variable
   */
  uint public counter;
  uint public lastTimeStamp;
  // uint public lastBlockNumber;
  /**
   * Use an interval in seconds and a timestamp to slow execution of Upkeep
   */
  uint public immutable i_interval;
  uint public immutable i_amount;
  uint public immutable i_round;
  address public immutable i_receiver;
  address public immutable i_ERC20Token;
  address public immutable i_sender;
  address public immutable i_credit;
  address public immutable i_DAOAddress;

  event AutomationTransfer(address indexed, address indexed, uint256 indexed);
  event WithdrawTransfer(address indexed, address indexed, uint256 indexed);

  event Mint(address indexed, uint256 indexed);

  constructor(UpkeeperContract.contractParams memory _contractParams, address _DAOAddress) {
    i_interval = _contractParams.updateInterval;
    i_ERC20Token = _contractParams._erc20Address;
    i_amount = _contractParams._amount;
    i_sender = _contractParams._sender;
    i_receiver = _contractParams._receiver;
    i_round = _contractParams._round;
    i_credit = _contractParams._credit;
    i_DAOAddress = _DAOAddress;

    counter = 0;
    lastTimeStamp = block.timestamp;
  }

  function checkUpkeep(
    bytes calldata /* checkData */
  ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > i_interval && counter < i_round;

    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
  }

  function performUpkeep(bytes calldata /* performData */) external override {
    if ((block.timestamp - lastTimeStamp) > i_interval) {
      if (i_ERC20Token == address(0)) {
        // the token is eth and transfer to employee address
        _ethTransfer(i_amount, i_receiver);
        emit AutomationTransfer(i_ERC20Token, i_receiver, i_amount);
      } else {
        // the token is erc20 and transfer to employee address
        _erc20Transfer(i_amount, i_receiver);
        emit AutomationTransfer(i_ERC20Token, i_receiver, i_amount);
      }
      // i_factory.creditMint(i_credit, i_sender, i_receiver);
      uint256 amount = 10000000000000000000;
      ICreditToken credit = ICreditToken(i_credit);

      credit.mint(i_sender, amount);
      emit Mint(i_sender, amount);
      credit.mint(i_receiver, amount);
      emit Mint(i_receiver, amount);
      lastTimeStamp = block.timestamp;
      counter = counter + 1;
    }
  }

  function getTokenBalance() public view returns (uint256 tokenAmount) {
    IERC20 token = IERC20(i_ERC20Token);
    return (token.balanceOf(address(this)));
  }

  function getETHBalance() public view returns (uint256 ethAmount) {
    ethAmount = address(this).balance;
  }

  function contractDestruct() external {
    if (i_ERC20Token == address(0)) {
      _ethTransfer(i_amount, i_DAOAddress);
      uint256 balance = getETHBalance();
      if (balance > 0) {
        (bool Success, ) = payable(i_sender).call{value: balance}("");
        require(Success, "ETH transfer to receiver failed");
      }
    } else {
      _erc20Transfer(i_amount, i_DAOAddress);
      uint256 balance = getTokenBalance();
      if (balance > 0) {
        IERC20(i_ERC20Token).safeTransfer(i_sender, balance);
      }
    }
    emit WithdrawTransfer(i_DAOAddress, i_sender, i_amount);
  }

  function _ethTransfer(uint256 _amount, address _receiver) internal {
    require(getETHBalance() > _amount, "ETH not enough");
    (bool Success, ) = payable(_receiver).call{value: _amount}("");
    require(Success, "ETH transfer to receiver failed");
  }

  function _erc20Transfer(uint256 _amount, address _receiver) internal {
    uint256 balance = getTokenBalance();
    require(balance >= _amount, "Not enough token");
    IERC20(i_ERC20Token).safeTransfer(_receiver, _amount);
  }

  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
