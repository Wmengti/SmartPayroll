// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./ContractNFT.sol";
import "./SmartPayrollByTime.sol";

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

interface KeeperRegistrarInterface {
  function registerAndPredictID(RegistrationParams memory params) external returns (uint256);
}

contract SmartPayrollFactory {
  event UpkeepContractCreateAddress(address,SmartPayrollByTime.contractParams,uint256 );
  event upKeeperCreate(uint256,RegistrationParams);


  constructor() {}

  function createTask(address _employeeAddress) external {
    require(msg.sender != _employeeAddress, "Do not send to yourself");
    ContractNFT contractNFT = new ContractNFT(_employeeAddress);
    contractNFT.safeMint(msg.sender);
    contractNFT.safeMint(_employeeAddress);
  }

  function createUpkeepContract(
    SmartPayrollByTime.contractParams memory _upkeepContractParams
    ,uint256 _amount
  ) external  {
    SmartPayrollByTime smartPayrollByTime = new SmartPayrollByTime(_upkeepContractParams, _amount);
    emit UpkeepContractCreateAddress(address(smartPayrollByTime),_upkeepContractParams, _amount);
  }


  function createKeeper(
    address _keeperRegistar,
    RegistrationParams calldata _registarParams
  ) external  {
    require(_keeperRegistar != address(0), "Not Registar");

    KeeperRegistrarInterface regustrar = KeeperRegistrarInterface(_keeperRegistar);
    uint256 keeperID = regustrar.registerAndPredictID(_registarParams);
    emit upKeeperCreate(keeperID,_registarParams);
    
  }
}
