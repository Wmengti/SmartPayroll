// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAOVault is AccessControl{
  address immutable i_employer;
  address immutable i_employee;
  address immutable i_ERC20Token;
  address public admin;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  event WithRrawFoundsEvent(bytes);
  event TransferEvent(address,uint256);

  constructor(address _employer,address _employee,address _ERC20Address){
    _grantRole(ADMIN_ROLE, msg.sender);

    i_employer = _employer;
    i_employee = _employee;
    i_ERC20Token = _ERC20Address;
    admin = msg.sender;
  }

  function withdrawFunds(bytes memory response) external {
    // require(msg.sender ==admin,"no access");
    bytes memory res = hex"466f72";
    // require(response.length>0,"response is error");
    if(response.length==res.length){
      bool isEqual = true;
      for(uint i = 0; i < response.length; i++){
        if(response[i]!=res[i]){
          isEqual = false;
          break;
        }
      }
      if (isEqual){
        _transfer(i_employer);
      } else{
        _transfer(i_employee); 
      }
      
      
    }else{
     _transfer(i_employee);
    }
    emit WithRrawFoundsEvent(response);
  }

  function _transfer(address _receiver) internal  {
   
    if(i_ERC20Token==address(0)){
      bool Success;
      uint256 ethBalance = getETHBalance();
      require(ethBalance>0,"ETH is not enough");
      (Success,) = payable(_receiver).call{value:ethBalance}("");
      require(Success, "ETH transfer to receiver failed");
      emit TransferEvent(_receiver,ethBalance);
    }else{
      IERC20 token = IERC20(i_ERC20Token);
      uint256 tokenBalance = getTokenBalance();
      require(tokenBalance>0,"erc20 token is not enough");
      require(token.transfer(_receiver,tokenBalance),"Token transfer to receiver failed");

    }

  }

    function getTokenBalance() public view returns (uint256 tokenAmount) {
    IERC20 token = IERC20(i_ERC20Token);
    return(token.balanceOf(address(this)));
  }

  function getETHBalance() public view returns (uint256 ethAmount) {
    ethAmount = address(this).balance;
  }

   receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}

}