// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAOVault is AccessControl{
  address employer;
  address employee;
  address ERC20Token;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  event WithRrawFoundsEvent(bytes);
  event TransferEvent(address,uint256);

  constructor(address _employer,address _employee,address _ERC20Address){
    _grantRole(ADMIN_ROLE, msg.sender);
    employer = _employer;
    employee = _employee;
    ERC20Token =_ERC20Address;
  }

  function withdrawFunds(bytes memory response) external onlyRole(ADMIN_ROLE){
    bytes memory res = hex"466f72";
    if(response.length==res.length){
      bool isEqual = true;
      for(uint i = 0; i < response.length; i++){
        if(response[i]!=res[i]){
          isEqual = false;
          break;
        }
      }
      if (isEqual){
        transfer(employer);
      } else{
        transfer(employee); 
      }
      
      
    }else{
     transfer(employee);
    }
    emit WithRrawFoundsEvent(response);
  }

  function transfer(address _receiver) internal  {
   
    if(ERC20Token==address(0)){
      bool Success;
      uint256 ethBalance = address(this).balance;
      require(ethBalance>0,"ETH is not enough");
      (Success,) = payable(_receiver).call{value:ethBalance}("");
      require(Success, "ETH transfer to receiver failed");
      emit TransferEvent(_receiver,ethBalance);
    }else{
      IERC20 token =IERC20(ERC20Token);
      uint256 tokenBalance = token.balanceOf(address(this));
      require(tokenBalance>0,"erc20 token is not enough");
      require(token.transfer(_receiver,tokenBalance),"Token transfer to receiver failed");

    }

  }

   receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}

}