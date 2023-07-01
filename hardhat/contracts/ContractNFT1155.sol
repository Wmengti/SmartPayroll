// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract ContractNFT1155 is ERC1155, ERC1155URIStorage, AccessControl {
  using Strings for uint256;

  uint256 private _tokenIdCounter = 1;

  error IsZeroAddress();

  event MintPair(address indexed employer, address indexed employee, uint256 tokenId);

  constructor() ERC1155("") {}

  function mintPair(address _employer, address _employee, string memory contractName) external {
    if (address(0) == _employer || address(0) == _employee) revert IsZeroAddress();

    _mint(_employer, _tokenIdCounter, 1, "");
    _mint(_employee, _tokenIdCounter, 1, "");
    _setURI(_tokenIdCounter, _getTokenURI(_tokenIdCounter, contractName));
    _tokenIdCounter += 1;
    emit MintPair(_employer, _employee, _tokenIdCounter);
  }

  function _generateImage(string memory contractName) internal view returns (string memory) {
    bytes memory svg = abi.encodePacked(
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
      "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
      '<rect width="100%" height="100%" fill="black" />',
      '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
      contractName,
      "</text>",
      '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
      "BlockDateTime: ",
      (block.timestamp).toString(),
      "</text>",
      "</svg>"
    );
    return string(abi.encodePacked("data:image/svg+xml;base64,", Base64.encode(svg)));
  }

  function _getTokenURI(uint256 tokenId, string memory contractName) internal view returns (string memory) {
    bytes memory dataURI = abi.encodePacked(
      "{",
      '"name": "smart payroll contract #',
      tokenId.toString(),
      '",',
      '"description": "smart payroll on chain",',
      '"image": "',
      _generateImage(contractName),
      '"',
      "}"
    );
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(dataURI)));
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal pure override {
    require(from == address(0) || to == address(0), "Not allowed to transfer token");
  }

  // function _afterTokenTransfer(
  //   address operator,
  //   address from,
  //   address to,
  //   uint256[] memory ids,
  //   uint256[] memory amounts,
  //   bytes memory data
  // ) internal virtual override {
  //   if (from == address(0)) {
  //     emit Attest(from, firstTokenId);
  //   } else if (to == address(0)) {
  //     emit Revoke(to, firstTokenId);
  //   }
  // }

  function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
    return super.uri(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
