// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract ContractNFT is ERC721, ERC721URIStorage, AccessControl {
  using Counters for Counters.Counter;
  using Strings for uint256;
  Counters.Counter private _tokenIdCounter;
  uint256 private immutable i_time;
  string private  contractName;

  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

  // event list
  event SafeMint(address to, uint256 tokenId);
  event Attest(address indexed to, uint256 indexed firstTokenId);
  event Revoke(address indexed to, uint256 indexed firstTokenId);

  constructor(string memory _name) ERC721("Contract Soul Bound Token", "CBT") {
    contractName = _name;
    i_time = block.timestamp;
    _grantRole(ADMIN_ROLE, msg.sender);
  }

 

  function safeMint(address to) external onlyRole(ADMIN_ROLE) {
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, _getTokenURI(tokenId));
    emit SafeMint(to, tokenId);
  }

  function _generateImage(uint256 tokenId) internal returns (string memory) {
    bytes memory svg = abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
      "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
      '<rect width="100%" height="100%" fill="black" />',
      '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
      contractName,
      "</text>",
      '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "BlockDateTime: ",
      i_time.toString(),
      "</text>",
      "</svg>"
    );
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

   function _getTokenURI(uint256 tokenId) internal returns (string memory) {
    bytes memory dataURI = abi.encodePacked(
      "{",
      '"name": "smart payroll contract #',
      tokenId.toString(),
      '",',
      '"description": "smart payroll on chain",',
      '"image": "',
      _generateImage(tokenId),
      '"',
      "}"
    );
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
  }
  // function burn(uint256 tokenId) external  {
  //   _burn(tokenId);
  //   emit burn(tokenId);
  // }

  // function revoke(uint256 tokenId) external onlyRole(EMPLOYER_ROLE) {
  //   _burn(tokenId);
  // }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal pure override {
    require(from == address(0) || to == address(0), "Not allowed to transfer token");
  }

  function _afterTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    if (from == address(0)) {
      emit Attest(to, firstTokenId);
    } else if (from == address(0)) {
      emit Revoke(to, firstTokenId);
    }
  }

  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
