// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DAOVault is AccessControl {
  using SafeERC20 for IERC20;

  address public immutable i_employer;
  address public immutable i_employee;
  address public immutable i_ERC20Token;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant FUNDS_ROLE = keccak256("FUNDS_ROLE");
  bytes32 public constant RESULT = keccak256(hex"466f72");
  bytes32 public CALLBACK;
  event WithRrawFoundsEvent(bytes response);
  event TransferEvent(address receiver, uint256 amount);

  constructor(address _employer, address _employee, address _ERC20Address, address _FunctionsFactory) {
    _grantRole(ADMIN_ROLE, _FunctionsFactory);

    i_employer = _employer;
    i_employee = _employee;
    i_ERC20Token = _ERC20Address;
  }

  function withdrawFunds(bytes memory response) external onlyRole(FUNDS_ROLE) {
    // require(msg.sender ==admin,"no access");
    require(response.length > 0, "response is error");
    CALLBACK = keccak256(response);
    if (RESULT == CALLBACK) {
      _transfer(i_employer);
    } else {
      _transfer(i_employee);
    }
    emit WithRrawFoundsEvent(response);

    // if(response.length==res.length){
    //   bool isEqual = true;
    //   for(uint i = 0; i < response.length; i++){
    //     if(response[i]!=res[i]){
    //       isEqual = false;
    //       break;
    //     }
    //   }
    //   if (isEqual){
    //     _transfer(i_employer);
    //   } else{
    //     _transfer(i_employee);
    //   }
    // }else{
    //  _transfer(i_employee);
    // }
  }

  function _transfer(address _receiver) internal {
    if (i_ERC20Token == address(0)) {
      bool Success;
      uint256 ethBalance = getETHBalance();
      require(ethBalance > 0, "ETH is not enough");
      (Success, ) = payable(_receiver).call{value: ethBalance}("");
      require(Success, "ETH transfer to receiver failed");
      emit TransferEvent(_receiver, ethBalance);
    } else {
      IERC20 token = IERC20(i_ERC20Token);
      uint256 tokenBalance = getTokenBalance();
      require(tokenBalance > 0, "erc20 token is not enough");
      token.safeTransfer(_receiver, tokenBalance);
      emit TransferEvent(_receiver, tokenBalance);
    }
  }

  function getTokenBalance() public view returns (uint256 tokenAmount) {
    IERC20 token = IERC20(i_ERC20Token);
    return (token.balanceOf(address(this)));
  }

  function getETHBalance() public view returns (uint256 ethAmount) {
    ethAmount = address(this).balance;
  }

  function grantRole(bytes32 role, address account) public override onlyRole(ADMIN_ROLE) {
    _grantRole(role, account);
  }

  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
