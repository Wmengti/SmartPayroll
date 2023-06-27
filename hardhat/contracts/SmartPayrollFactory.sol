// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {SmartPayrollByTime} from "./SmartPayrollByTime.sol";
import {DAOVault} from "./DAOVault.sol";
import {ICreditToken} from "./interface/ICreditToken.sol";
import {IKeeperAutoSelfRegister} from "./interface/IKeeperAutoSelfRegister.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Registration} from "./library/Registration.sol";
import {UpkeeperContract} from "./library/UpkeeperContract.sol";

contract SmartPayrollFactory is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  mapping(address => uint256) public upkeepContractToID;
  mapping(address => address) public UpkeepAddressToDAO;

  event UpkeepContractCreateAddress(address smartPayrollByTime, UpkeeperContract.contractParams contractParams);
  event UpKeeperCreate(uint256 keeperID, Registration.RegistrationParams registarParams);
  event DAOVaultCreate(address daoVault, address sender, address receiver);

  constructor() {
    _grantRole(ADMIN_ROLE, msg.sender);
  }

  /*
   * @description: create new contract DAOVault adn smart payroll contract
   * @return {*}
   */
  function createUpkeepContract(UpkeeperContract.contractParams memory _upkeepContractParams) external {
    DAOVault daoVault = new DAOVault(
      _upkeepContractParams._sender,
      _upkeepContractParams._receiver,
      _upkeepContractParams._erc20Address,
      _upkeepContractParams._FunctionsFactory
    );
    emit DAOVaultCreate(address(daoVault), _upkeepContractParams._sender, _upkeepContractParams._receiver);
    SmartPayrollByTime smartPayrollByTime = new SmartPayrollByTime(_upkeepContractParams, address(daoVault));
    emit UpkeepContractCreateAddress(address(smartPayrollByTime), _upkeepContractParams);
    UpkeepAddressToDAO[address(smartPayrollByTime)] = address(daoVault);
  }

  /*
   * @description: it can execute the upkeeper register
   * @return {*}
   */
  function createKeeper(address _keeperRegistar, Registration.RegistrationParams memory _registarParams) external {
    require(_keeperRegistar != address(0), "Not Registar");

    IKeeperAutoSelfRegister regustrar = IKeeperAutoSelfRegister(_keeperRegistar);
    uint256 keeperID = regustrar.registerAndPredictID(_registarParams);
    upkeepContractToID[_registarParams.upkeepContract] = keeperID;
    emit UpKeeperCreate(keeperID, _registarParams);
  }

  /*
   * @description: get upkeeperID by SmartPayrollByTime
   * @param {address} _upkeepContract
   * @return {*}
   */
  function getUpkeeperID(address _upkeepContract) public view returns (uint256 upkeepID) {
    return upkeepContractToID[_upkeepContract];
  }

  /*
   * @description: get DAOAddress by SmartPayrollByTime
   * @param {address} _upkeepContract
   * @return {*}
   */
  function getDAOAddress(address _upkeepContract) public view returns (address DAOAddress) {
    return UpkeepAddressToDAO[_upkeepContract];
  }

  /*
   * @description: mint create token when fulfilling the contract SmartPayrollByTime
   * @param {address} _creditAddress
   * @param {address} _employer
   * @param {address} _employee
   * @return {*}
   */
  // function creditMint(address _creditAddress, address _employer, address _employee) external {
  //   require(_employer != _employee, "not send the same address");
  //   ICreditToken(_creditAddress).mint(_employer, 10000000000000000000);
  //   ICreditToken(_creditAddress).mint(_employee, 10000000000000000000);
  // }

  /*
   * @description: when snapshot response the result it will be executed.
   * @param {bytes memory} response
   * @param {address payable} _DAOAddress
   * @return {*}
   */
  // function withdrawDAOVault(bytes memory response, address payable _DAOAddress) external {
  //   DAOVault(_DAOAddress).withdrawFunds(response);
  // }
}
