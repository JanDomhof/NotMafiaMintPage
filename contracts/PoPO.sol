//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoPO is ERC721 {
    // Mapping the erc721 address to owner adresses
    mapping(address => mapping(address => bool)) ownerShips;

    constructor() ERC721("PoPO", "PoPO") {}

    function _alreadyClaimed(address erc721) internal view returns (bool) {
        return ownerShips[erc721][msg.sender];
    }

    function claim(address __collection, address __wallet)
        external
        view
        returns (uint256)
    {
        IERC721 token = IERC721(__collection);

        return token.balanceOf(__wallet);
    }
}
