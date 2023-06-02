// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


import "./SmartPayrollByTime.sol";
import "./DAOVault.sol";

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
// struct contractParams {
//     uint updateInterval;
//     address _erc20Address;
//     address _sender;
//     address _receiver;
//     uint256 _round;
//   }
interface KeeperRegistrarInterface {
  function registerAndPredictID(RegistrationParams memory params) external returns (uint256);
}
interface IcreditToken {
  function mint(address to, uint256 amount) external ;
}



contract SmartPayrollFactory {
  event UpkeepContractCreateAddress(address,SmartPayrollByTime.contractParams,uint256 );
  event UpKeeperCreate(uint256,RegistrationParams);
  event DAOVaultCreate(address,address,address);


  constructor() {}

 

  function createUpkeepContract(
    SmartPayrollByTime.contractParams memory _upkeepContractParams
    ,uint256 _amount
    ,address _credit
    
  ) external  {
    DAOVault daoVault = new DAOVault(_upkeepContractParams._sender,_upkeepContractParams._receiver,_upkeepContractParams._erc20Address);
    emit DAOVaultCreate(address(daoVault),_upkeepContractParams._sender,_upkeepContractParams._receiver);
    SmartPayrollByTime smartPayrollByTime = new SmartPayrollByTime(_upkeepContractParams, _amount,address(this),_credit,address(daoVault));
    emit UpkeepContractCreateAddress(address(smartPayrollByTime),_upkeepContractParams, _amount);
  }


  function createKeeper(
    address _keeperRegistar,
    RegistrationParams calldata _registarParams
  ) external  {
    require(_keeperRegistar != address(0), "Not Registar");

    KeeperRegistrarInterface regustrar = KeeperRegistrarInterface(_keeperRegistar);
    uint256 keeperID = regustrar.registerAndPredictID(_registarParams);
    emit UpKeeperCreate(keeperID,_registarParams);
    
  }

  function CreditMint(address _creditAddress,address _employer,address _employee) external {
    IcreditToken(_creditAddress).mint(_employer,10000000000000000000);
    IcreditToken(_creditAddress).mint(_employee,10000000000000000000);

  }

  function withdrawDAOVault(bytes memory response,address payable _DAOAddress) external {
    
    DAOVault(_DAOAddress).withdrawFunds(response);
  }
}
