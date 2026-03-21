// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Marketplace is ERC721Holder {
    struct Listing {
        address seller;
        uint256 price;
    }

    // nftContract → tokenId → listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    function listNFT(address nft, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");

        IERC721 token = IERC721(nft);

        // Must be owner
        require(token.ownerOf(tokenId) == msg.sender, "Not owner");

        // Transfer NFT to marketplace (you can remove this if you prefer escrow-less)
        token.safeTransferFrom(msg.sender, address(this), tokenId);

        listings[nft][tokenId] = Listing(msg.sender, price);
    }

    function updatePrice(
        address nft,
        uint256 tokenId,
        uint256 newPrice
    ) external {
        Listing storage item = listings[nft][tokenId];
        require(item.seller == msg.sender, "Not your listing");
        item.price = newPrice;
    }

    function buy(address nft, uint256 tokenId) external payable {
        Listing memory item = listings[nft][tokenId];
        require(item.price > 0, "Not listed");
        require(msg.value == item.price, "Incorrect ETH");

        // Pay seller
        payable(item.seller).transfer(msg.value);

        // Transfer NFT to buyer
        IERC721(nft).safeTransferFrom(address(this), msg.sender, tokenId);

        // Remove listing
        delete listings[nft][tokenId];
    }
}
