// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./interface/ISmartPayrollFactory.sol";
import "./interface/ICreditToken.sol";


// interface ISmartPayrollFactory {
//   function creditMint(address _creditAddress,address _employer,address _employee) external;
//   function getUpkeeperID(address _upkeepContract) external returns(uint256);
// }
contract SmartPayrollByTime is AutomationCompatible {
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



  struct contractParams {
    uint updateInterval;
    address _erc20Address;
    address _sender;
    address _receiver;
    uint256 _round;
    uint256 _amount;
    address _credit;
  }

  event AutomationTransfer(address indexed, address indexed, uint256 indexed);
  event WithdrawTransfer(address indexed, address indexed, uint256 indexed);

  event Mint( address indexed, uint256 indexed);

  constructor(contractParams memory _contractParams,  address _DAOAddress) {
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
    //  uint256 upKeepID;
    //We highly recommend revalidating the upkeep in the performUpkeep function
    if ((block.timestamp - lastTimeStamp) > i_interval) {
      if (i_ERC20Token == address(0)) {
        require(getETHBalance() > i_amount, "ETH not enough");
        payable(i_receiver).transfer(i_amount);
      } else {
        uint256 balance = getTokenBalance();
        require(balance >= i_amount, "Not enough token");
        bool transferSuccess = IERC20(i_ERC20Token).transfer(i_receiver, i_amount);
        require(transferSuccess, "Token transfer to empolyee failed");
        emit AutomationTransfer(i_ERC20Token, i_receiver, i_amount);
      }
      // i_factory.creditMint(i_credit, i_sender, i_receiver);
      uint256 amount = 10000000000000000000;
      ICreditToken credit = ICreditToken(i_credit);

      credit.mint(i_sender,amount);
      emit Mint( i_sender, amount);
      credit.mint(i_receiver,amount);
      emit Mint(i_receiver, amount);
      lastTimeStamp = block.timestamp;
      counter = counter + 1;
      // if(counter==i_round){
      //   upKeepID = i_factory.getUpkeeperID(address(this));
      // }
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
      bool transferSuccess;
      require(getETHBalance() > i_amount, "ETH not enough");
      (transferSuccess, ) = payable(i_DAOAddress).call{value: i_amount}("");
      require(transferSuccess, "Token transfer to DAOAddress failed");
      (transferSuccess, ) = payable(i_sender).call{value: i_amount}("");
    } else {
      IERC20 token = IERC20(i_ERC20Token);
      require(getTokenBalance() >= i_amount, "Not enough token");
      bool transferSuccess = token.transfer(i_DAOAddress, i_amount);
      require(transferSuccess, "Token transfer to DAOAddress failed");

      transferSuccess = token.transfer(i_sender, token.balanceOf(address(this)));
    }
    emit WithdrawTransfer(i_DAOAddress, i_sender, i_amount);
  }

  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
