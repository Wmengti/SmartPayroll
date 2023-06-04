// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// AutomationCompatible.sol imports the functions from both ./AutomationBase.sol and
// ./interfaces/AutomationCompatibleInterface.sol

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./interface/ISmartPayrollFactory.sol";




// interface ISmartPayrollFactory {
//   function creditMint(address _creditAddress,address _employer,address _employee) external;
//   function getUpkeeperID(address _upkeepContract) external returns(uint256);
// }
contract SmartPayrollByTime is AutomationCompatible{
  /**
   * Public counter variable
   */
  uint public counter;
  uint public lastTimeStamp;
  uint public lastBlockNumber;
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

  

  ISmartPayrollFactory public immutable i_factory;



  struct contractParams {
    uint updateInterval;
    address _erc20Address;
    address _sender;
    address _receiver;
    uint256 _round;
    uint256 _amount;
    address _credit;

  }

  constructor(contractParams memory _contractParams, address _factory,address _DAOAddress) {
    i_interval = _contractParams.updateInterval; 
    i_ERC20Token = _contractParams._erc20Address;
    i_amount = _contractParams._amount;
    i_sender = _contractParams._sender;
    i_receiver = _contractParams._receiver;
    i_round = _contractParams._round;
    i_credit = _contractParams._credit;
    i_DAOAddress =_DAOAddress;

    i_factory =ISmartPayrollFactory(_factory);
   



    counter = 0;
    lastTimeStamp = block.timestamp;
  }

  // function deposit() payable public {
  //     if(ERC20Token == address(0)){i_registry
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
      
    
        upkeepNeeded = (block.timestamp - lastTimeStamp) > i_interval ;
     

    // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
  }

  function performUpkeep(bytes calldata /* performData */) external override {
     uint256 upKeepID;
    //We highly recommend revalidating the upkeep in the performUpkeep function
    if( counter <i_round){
      if (i_ERC20Token == address(0)) {
       
        require(getETHBalance() > i_amount, "ETH not enough");
        payable(i_receiver).transfer(i_amount);
      } else {

        require(getTokenBalance() >= i_amount, "Not enough token");
        IERC20(i_ERC20Token).transfer(i_receiver, i_amount);
      }
      i_factory.creditMint(i_credit,i_sender,i_receiver);
      lastTimeStamp = block.timestamp;
      counter = counter + 1;
      // if(counter==i_round){
      //   upKeepID = i_factory.getUpkeeperID(address(this));
      // }
      
   
    
  }
  }

  function getTokenBalance() public view returns (uint256 tokenAmount) {
    IERC20 token = IERC20(i_ERC20Token);
    return(token.balanceOf(address(this)));
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
        bool transferSuccess =  token.transfer(i_DAOAddress, i_amount);
        require(transferSuccess, "Token transfer to DAOAddress failed");
     
        transferSuccess =  token.transfer(i_sender, token.balanceOf(address(this)));
 

      }

}


  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
