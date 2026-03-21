// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20, Ownable {
    mapping(address => bool) public hasClaimed;

    constructor() ERC20("Mock USDT", "fUSDT") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // ✅ Faucet: each user can claim 100 only once
    function faucet() external {
        require(!hasClaimed[msg.sender], "Already claimed");
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    // ✅ Optional: admin mint (for testing / airdrops)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
