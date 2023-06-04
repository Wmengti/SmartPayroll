// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./SmartPayrollByTime.sol";
import "./DAOVault.sol";
import "./interface/ICreditToken.sol";


struct RegistrationParams {
    string name;
    bytes encryptedEmail;
    address upkeepContract;
    uint32 gasLimit;
    address adminAddress;
    bytes checkData;
    bytes offchainConfig;
    uint96 amount;
  }
interface IKeeperAutoSelfRegister {
  function registerAndPredictID(RegistrationParams memory params) external returns (uint256);
}



contract SmartPayrollFactory {
  

  mapping(address => uint256) public upkeepContractToID;

  event UpkeepContractCreateAddress(address, SmartPayrollByTime.contractParams);
  event UpKeeperCreate(uint256, RegistrationParams);
  event DAOVaultCreate(address, address, address);

  constructor() {}

  /*
   * @description: create new contract DAOVault adn smart payroll contract
   * @return {*}
   */
  function createUpkeepContract(SmartPayrollByTime.contractParams memory _upkeepContractParams) external {
    DAOVault daoVault = new DAOVault(
      _upkeepContractParams._sender,
      _upkeepContractParams._receiver,
      _upkeepContractParams._erc20Address
    );
    emit DAOVaultCreate(address(daoVault), _upkeepContractParams._sender, _upkeepContractParams._receiver);
    SmartPayrollByTime smartPayrollByTime = new SmartPayrollByTime(
      _upkeepContractParams,
      address(this),
      address(daoVault)
    );
    emit UpkeepContractCreateAddress(address(smartPayrollByTime), _upkeepContractParams);
  }

  /*
   * @description: it can execute the upkeeper register
   * @return {*}
   */
  function createKeeper(address _keeperRegistar, RegistrationParams memory _registarParams) external {
    require(_keeperRegistar != address(0), "Not Registar");

    IKeeperAutoSelfRegister regustrar = IKeeperAutoSelfRegister(_keeperRegistar);
    uint256 keeperID = regustrar.registerAndPredictID(_registarParams);
    upkeepContractToID[_registarParams.upkeepContract] = keeperID;
    emit UpKeeperCreate(keeperID, _registarParams);
  }

  /*
   * @description: mint create token when fulfilling the contract SmartPayrollByTime
   * @param {address} _creditAddress
   * @param {address} _employer
   * @param {address} _employee
   * @return {*}
   */
  function creditMint(address _creditAddress, address _employer, address _employee) external {
    require(_employer!=_employee,"not send the same address");
    ICreditToken(_creditAddress).mint(_employer, 10000000000000000000);
    ICreditToken(_creditAddress).mint(_employee, 10000000000000000000);
  }

  /*
   * @description: when snapshot response the result it will be executed.
   * @param {bytes memory} response
   * @param {address payable} _DAOAddress
   * @return {*}
   */
  function withdrawDAOVault(bytes memory response, address payable _DAOAddress) external {
    DAOVault(_DAOAddress).withdrawFunds(response);
  }

  /*
   * @description: get upkeeperID by SmartPayrollByTime
   * @param {address} _upkeepContract
   * @return {*}
   */
  function getUpkeeperID(address _upkeepContract) public returns (uint256 upkeepID) {
    return upkeepContractToID[_upkeepContract];
  }
}
