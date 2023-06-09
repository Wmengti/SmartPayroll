<!--
 * @Author: Wmengti 0x3ceth@gmail.com
 * @LastEditTime: 2023-07-13 15:32:06
 * @Description: 
-->
## Project Architecture
**Smart Contract and Salary Disbursement**: Employers and employees need to communicate in advance regarding the salary payment method. The employer creates a smart contract where the platform issues identical network contracts to both the employer and employee in the form of NFTs. The NFT records the contract creation time and contract name. The employer specifies the currency type, amount, payment cycle, and rounds, and deposits the amount into the contract.

**DAO Organization and Arbitration Mechanism**: The contract is regularly disbursed to the employee, ensuring their interests are protected. However, if the employer's interests are compromised during the collaboration, the employer can initiate an appeal on the snapshot.org platform, triggering a DAO vote to determine whether the violation should be acknowledged. The DAO consists of employers and employees with good credit records on the platform. They will vote on the subsequent actions based on the appeal.

**Credit Scoring System and Incentive Mechanism**: The platform assigns credit scores to employers and employees based on their performance in fulfilling contracts, establishing an identity credit system. Each participation in the DAO vote rewards the participants with credit points and tokens. These tokens can be used for other activities within the platform or exchanged for other forms of rewards.

**Dividends for DAO Members**: DAO members not only participate in decision-making but also receive dividends from the platform. In fact, they become part owners of the platform in economic terms. This provides them with further incentives and a sense of responsibility and belonging.


## Features

**The MVP version will only implement basic functionality.**

1. Employers initiate contracts and select salary payment methods. By executing a smart contract, employers need to deposit the corresponding funds, and the deployment cost of the smart contract is borne by the employer.
2. The platform covers the LINK fees for using the automation platform provided by CHAINLINK.
3. In case of disputes before or during the execution of the contract, either party can file a lawsuit on snapshot.org. The DAO members vote to determine the outcome, and the contract receives the voting result from the DAO to determine the allocation of funds to a specific party.
4. After each fulfillment of the contract, both the employer and employee receive a credit value, CT.
5. Voting rights are granted to members with good reputation, i.e., those who possess CT.
6. After the voting deadline on the snapshot platform, the smart contract utilizes the functions API to obtain the voting result and automatically attribute the salary accordingly.

**Upcoming Feature Updates:**

1. Contract storage on AWS.
2. Selection of DAO members: Platform members, employers, and employees choose an equal number of individuals proportionally.
3. All DAO members receive a token value as a reward each time they participate in voting. Later, new tokens will be distributed based on this token count. The voting records of DAO members are recorded, and employees (employers) can view the historical DAO votes of the employers (employees) they are interested in.
4. All historical votes are traceable to prevent the existence of a large number of unfair votes by malicious users.
5. With a certain user base or accumulated funds, develop DeFi functionality.

## Technical Implementation

1. Technologies: TypeScript, Node.js, Hardhat, Next.js, MongoDB.
2. Smart Contracts:
    - [Contract NFT](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/ContractNFT.sol): Records contract time and contract name.
    - [Contract NFT Clone](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/ContractNFTClone.sol): Records contract time and contract name.Save half the gas with minimal proxy
    - [Contract NFT Factory](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/ContractNFTFactory.sol): Generates a new NFT contract for each contract creation, minting two identical NFTs.**UPDATE**: Using Minimal Proxy,check in test/uints
    - [Contract NFT1155](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/ContractNFT1155.sol): Consider the gas cost, it will replace both the ContractNFT and ContractNFTFactory.
    - [Credit Contract](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/CreditToken.sol): Automatically mints NFTs for the employer and employee after successful salary disbursement.
    - [DAO Vault](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/DAOVault.sol): In case of disputes, the amount to be disbursed in the current round is transferred to the DAO treasury, while the remaining amount is returned to the employer. After the voting ends, the DAO treasury transfers the funds to the employer or employee. Each DAO treasury contract is generated by the factory contract.
    - [Registry Contract](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/KeeperAutoSelfRegister.sol): Registers the execution contracts to the Chainlink Automation platform, including the LINK balance.
    - [Execution Contract](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/SmartPayrollByTime.sol): Contract responsible for the timely fulfillment and salary disbursement.
    - [Execution Contract Factory](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/SmartPayrollFactory.sol): Generates a new execution contract for each contract.
    - [Functions Contract](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/AutomatedFunctions.sol): Reads the Snapshot API and returns the voting result, enabling the execution of salary attribution based on the result.
    - [Functions Contract Factory](https://github.com/Wmengti/SmartPayroll/blob/main/hardhat/contracts/FunctionsFactory.sol): Generates new functions contracts for different contracts.

3. Frontend Functionality:
   Due to the whitelist requirement for address registration in functions, the execution of functions is performed through an EOA (Externally Owned Account) in the frontend. For demonstration purposes, the platform's EOA and signer are used to interact with the contracts.

## Future Vision

The future vision is to develop a reputation system for professionals, creating a system that encompasses both project owners and professionals. This system aims to objectively showcase the projects professionals have participated in (potentially anonymously) and the contributions they have made, thereby reducing information asymmetry.

- When creating a contract, an NFT can be generated to indicate the past collaboration between both parties.
- Individuals who have used the platform will leave behind professional credentials, which will contribute to building their industry reputation.

