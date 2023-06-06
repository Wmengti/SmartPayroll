// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @author Anderson Singh. 
/// @title  An implement of Fake USDT for testing creation of a liquidity pool in Uniswap V2.

contract FakeUSDT is ERC20 {

    constructor() ERC20('Fake USDT', 'USDT') {
        // mint 1 billion Fake USDT to contract creator.
        _mint(msg.sender, 1000000000000000);
    }

    /// @dev set decimals to 6. 
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

     function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
}