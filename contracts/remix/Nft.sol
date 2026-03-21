// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol"; // Official OZ Base64
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract CharapiaNft is ERC721, Ownable {
    using Strings for uint256;

    uint256 public nextTokenId = 1;
    address public marketplaceAddress;

    struct Character {
        string name;
        string image;
    }

    mapping(uint256 => Character) public characters;
    event Minted(
        address indexed minter,
        uint256 indexed tokenId,
        string name,
        string image
    );

    // Updated Constructor for OZ v5
    constructor(
        address _marketplaceAddress
    ) ERC721("Charapia AI Character", "CHAI") Ownable(msg.sender) {
        marketplaceAddress = _marketplaceAddress;
    }

    function mint(
        string memory name_,
        string memory image_
    ) external returns (uint256) {
        require(bytes(name_).length > 0, "Name cannot be empty");
        require(bytes(image_).length > 0, "Image URL cannot be empty");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);
        characters[tokenId] = Character(name_, image_);

        // Auto-approve the marketplace
        if (marketplaceAddress != address(0)) {
            _setApprovalForAll(msg.sender, marketplaceAddress, true);
        }

        emit Minted(msg.sender, tokenId, name_, image_);

        return tokenId;
    }

    function getCharacter(
        uint256 tokenId
    ) external view returns (string memory name, string memory image) {
        // Check if token exists using the v5 helper
        _requireOwned(tokenId);

        Character memory character = characters[tokenId];
        return (character.name, character.image);
    }

    function setMarketplace(address _marketplaceAddress) external onlyOwner {
        marketplaceAddress = _marketplaceAddress;
    }

    // Fixed tokenURI for OpenZeppelin v5
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId); // Replaces _exists()

        Character memory character = characters[tokenId];

        // Construct JSON using string.concat (Cleaner in new Solidity)
        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name":"',
                    character.name,
                    '", "description":"Charapia AI Character NFT",',
                    '"image":"',
                    character.image,
                    '"}'
                )
            )
        );

        return string.concat("data:application/json;base64,", json);
    }
}