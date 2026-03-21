// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PriceOracleContract {
    address public admin;

    mapping(string => uint256) public prices; // commodity => price in USD cents
    string[] public commodities; // list of all commodities
    mapping(string => bool) private exists; // helper to avoid duplicates

    event PriceUpdated(string commodity, uint256 price);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    function updatePrice(string calldata commodity, uint256 price) external onlyAdmin {
        // Add new commodity to the list if not already present
        if (!exists[commodity]) {
            commodities.push(commodity);
            exists[commodity] = true;
        }
        prices[commodity] = price;
        emit PriceUpdated(commodity, price);
    }

    function getPrice(string calldata commodity) external view returns (uint256) {
        return prices[commodity];
    }

    // Fetch all commodities and their prices
    function getAllPrices() external view returns (string[] memory, uint256[] memory) {
        uint256[] memory allPrices = new uint256[](commodities.length);
        for (uint256 i = 0; i < commodities.length; i++) {
            allPrices[i] = prices[commodities[i]];
        }
        return (commodities, allPrices);
    }

    // Optional: get total number of commodities
    function getCommodityCount() external view returns (uint256) {
        return commodities.length;
    }
}
