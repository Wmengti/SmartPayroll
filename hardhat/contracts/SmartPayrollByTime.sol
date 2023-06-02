// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

interface ISmartPayrollFactory {
  function CreditMint(address _creditAddress,address _employer,address _employee) external;
}
contract SmartPayrollByTime is AutomationCompatibleInterface {
  /**
   * Public counter variable
   */
  uint public counter;

  /**
   * Use an interval in seconds and a timestamp to slow execution of Upkeep
   */
  uint public immutable interval;
  uint public lastTimeStamp;
  uint public immutable amount;
  uint public immutable round;
  address public immutable receiver;
  address public immutable ERC20Token;
  address public immutable sender;
  address public immutable factory;
  address public immutable credit;
  address public immutable DAOAddress;

  

  error IsZeroAddress();

  struct contractParams {
    uint updateInterval;
    address _erc20Address;
    address _sender;
    address _receiver;
    uint256 _round;
  }

  constructor(contractParams memory _contractParams, uint256 _amount,address _factory,address _credit,address _DAOAddress) {
    interval = _contractParams.updateInterval;
    lastTimeStamp = block.timestamp;
    ERC20Token = _contractParams._erc20Address;
    amount = _amount;
    sender = _contractParams._sender;
    receiver = _contractParams._receiver;
    round = _contractParams._round;
    factory = _factory;
    credit = _credit;
    DAOAddress =_DAOAddress;

    counter = 0;
  }

  // function deposit() payable public {
  //     if(ERC20Token == address(0)){
  //         payable(address(this)).transfer(amount);
  //     }else{
  //         IERC20(ERC20Token).transferFrom(msg.sender,address(this), amount);
  //     }

  // }

  // function changeERC20(address _erc20Token) external {
  //     ERC20Token = _erc20Token;
  // }

  function checkUpkeep(
    bytes calldata /* checkData */
  ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
    if (ERC20Token == address(0) && address(this).balance > amount) {
      upkeepNeeded = (block.timestamp - lastTimeStamp) > interval && counter < round;
    } else if (ERC20Token != address(0) && IERC20(ERC20Token).balanceOf(address(this)) >= amount) {
      upkeepNeeded = (block.timestamp - lastTimeStamp) > interval && counter < round;
    } else {
      upkeepNeeded = false;
    }

    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
  }

  function performUpkeep(bytes calldata /* performData */) external override {
    //We highly recommend revalidating the upkeep in the performUpkeep function
    if ((block.timestamp - lastTimeStamp) > interval) {
      if (ERC20Token == address(0)) {
        require(address(this).balance > amount, "ETH not enough");
        payable(receiver).transfer(amount);
      } else {
        require(IERC20(ERC20Token).balanceOf(address(this)) >= amount, "Not enough token");
        IERC20(ERC20Token).transfer(receiver, amount);
      }
      ISmartPayrollFactory(factory).CreditMint(credit,sender,receiver);
      lastTimeStamp = block.timestamp;
      counter = counter + 1;
    }
    // We don't use the performData in this example. The performData is generated by the Automation Node's call to your checkUpkeep function
  }

  function getTokenBalance(address _checkAddress, IERC20 _token) external view returns (uint256 tokenAmount) {
    if (_checkAddress == address(0)) revert IsZeroAddress();
    tokenAmount = _token.balanceOf(_checkAddress);
  }

  function getETHBalance(address _checkAddress) external view returns (uint256 ethAmount) {
    if (_checkAddress == address(0)) revert IsZeroAddress();
    ethAmount = _checkAddress.balance;
  }

  function contractDestruct() external {
   
      if (ERC20Token == address(0)) {
        bool transferSuccess;
        require(address(this).balance > amount, "ETH not enough");
        (transferSuccess, ) = payable(DAOAddress).call{value: amount}("");
        require(transferSuccess, "Token transfer to DAOAddress failed");
        // require(address(this).balance > 0 , "ETH not enough");
        (transferSuccess, ) = payable(sender).call{value: amount}("");
        // require(transferSuccess, "ETH transfer to sender failed");
      } else {
        IERC20 token = IERC20(ERC20Token);
        require(token.balanceOf(address(this)) >= amount, "Not enough token");
        bool transferSuccess =  token.transfer(DAOAddress, amount);
        require(transferSuccess, "Token transfer to DAOAddress failed");
        // require(token.balanceOf(address(this)) > 0 , "erc20 token not enough");
        transferSuccess =  token.transfer(sender, token.balanceOf(address(this)));
        // require(transferSuccess, "erc20 token transfer to sender failed");

      }

}


  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
