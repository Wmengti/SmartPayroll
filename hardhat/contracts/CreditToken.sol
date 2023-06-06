// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract CreditToken is ERC20, ERC20Snapshot, AccessControl, ERC20Permit {
  address public minter;
  bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


  event Attest(address indexed to, uint256 indexed amount);
  event Revoke(address indexed to, uint256 indexed amount);

  constructor(address _minter) ERC20("CreditToken", "CT") ERC20Permit("CreditToken") {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(SNAPSHOT_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, _minter);
    minter = _minter;
  }

  function snapshot() public onlyRole(SNAPSHOT_ROLE) {
    _snapshot();
  }

  function mint(address to, uint256 amount) public  {
    // require(msg.sender==minter,"no access");
    _mint(to, amount);
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Snapshot) {
    super._beforeTokenTransfer(from, to, amount);
    require(from == address(0) || to == address(0), "Not allowed to transfer token");
  }

  function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20) {
    if (from == address(0)) {
      emit Attest(to, amount);
    } else if (from == address(0)) {
      emit Revoke(to, amount);
    }
  }
}
