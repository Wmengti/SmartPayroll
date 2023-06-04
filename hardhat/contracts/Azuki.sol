// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Azuki is ERC721, Ownable {
    using Counters for Counters.Counter;
    uint256 public MAX_SUPPLY =10000;


    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Azuki", "Azuki") {}

    

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    return "https://dl.openseauserdata.com/cache/originImage/files/857cfb3a451a5e6c72c9f765985f9a03.png";
  }

    function safeMint() public  {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId<MAX_SUPPLY,"mint done!");
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
    }
}
