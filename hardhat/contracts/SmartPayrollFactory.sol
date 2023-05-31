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
interface IcreditToken {
  function mint(address to, uint256 amount) external ;
}

contract SmartPayrollFactory {
  event UpkeepContractCreateAddress(address,SmartPayrollByTime.contractParams,uint256 );
  event UpKeeperCreate(uint256,RegistrationParams);
  event CreateContractNFT(address,string);


  constructor() {}

  function createTask(address _employeeAddress,string memory contractName) external {
    require(msg.sender != _employeeAddress, "Do not send to yourself");
    ContractNFT contractNFT = new ContractNFT(_employeeAddress,contractName);
    emit CreateContractNFT(address(contractNFT),contractName);
    contractNFT.safeMint(msg.sender);
    contractNFT.safeMint(_employeeAddress);
  }

  function createUpkeepContract(
    SmartPayrollByTime.contractParams memory _upkeepContractParams
    ,uint256 _amount
    ,address _credit
  ) external  {
    SmartPayrollByTime smartPayrollByTime = new SmartPayrollByTime(_upkeepContractParams, _amount,address(this),_credit);
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
}
