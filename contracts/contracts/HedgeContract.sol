// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceOracle {
    function getPrice(string calldata commodity) external view returns (uint256);
}


interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);
}


contract HedgeContract {
    IPriceOracle public oracle;
    IERC20 public usdt;
    address public admin;

    struct HedgePosition {
        address owner;
        string commodity;
        uint256 amount;
        uint256 strikePrice;
        uint256 expireAt;
        uint256 lockedValue;
        bool closed;
    }

    // price in 1e18 format
    // USDT locked
    HedgePosition[] public positions;
    mapping(address => uint256[]) public userPositions;

    event HedgeCreated(
        uint256 indexed id,
        address indexed owner,
        string commodity,
        uint256 amount,
        uint256 strikePrice,
        uint256 expireAt,
        uint256 lockedValue
    );

    event HedgeClosed(uint256 indexed id, address indexed owner, uint256 finalPrice, uint256 payout);

    constructor(address oracleAddress, address usdtAddress) {
        require(oracleAddress != address(0), "Invalid oracle");
        require(usdtAddress != address(0), "Invalid USDT");
        oracle = IPriceOracle(oracleAddress);
        usdt = IERC20(usdtAddress);
        admin = msg.sender;
    }

    /**
     * Create hedge and lock USDT
     */
    function createHedge(string calldata commodity, uint256 amount, uint256 strikePrice, uint256 expireOption) external {
        require(amount > 0, "Amount must be > 0");
        require(strikePrice > 0, "Strike price must be > 0");
        uint256 expireAt;
        if (expireOption == 1) {
            expireAt = block.timestamp + 7 days ;
        } else if (expireOption == 2) {
            expireAt = block.timestamp + 14 days;
        } else if (expireOption == 3) {
            expireAt = block.timestamp + 30 days;
        } else if (expireOption == 4) {
            expireAt = block.timestamp + 60 days;
        } else {
            revert("Invalid expire option");
        }
        // 💰 Calculate USDT to lock
        uint256 totalValue = (amount * strikePrice) / 1e18;
        // 🔒 Transfer USDT from user → contract
        require(usdt.transferFrom(msg.sender, address(this), totalValue), "USDT transfer failed");
        HedgePosition memory newHedge = HedgePosition({owner: msg.sender, commodity: commodity, amount: amount, strikePrice: strikePrice, expireAt: expireAt, lockedValue: totalValue, closed: false});
        positions.push(newHedge);
        uint256 id = positions.length - 1;
        userPositions[msg.sender].push(id);
        emit HedgeCreated(id, msg.sender, commodity, amount, strikePrice, expireAt, totalValue);
    }

    /**
     * Close hedge and receive payout
     */
    function closeHedge(uint256 id) external {
        require(id < positions.length, "Invalid hedge ID");
        HedgePosition storage hedge = positions[id];
        require(msg.sender == hedge.owner, "Not your hedge");
        require(!hedge.closed, "Already closed");
        require(block.timestamp >= hedge.expireAt, "Not expired yet");
        uint256 currentPrice = oracle.getPrice(hedge.commodity);
        require(currentPrice > 0, "Invalid oracle price");
        hedge.closed = true;
        uint256 payout;
        // 📉 Price dropped → user protected
        if (currentPrice < hedge.strikePrice) {
            payout = hedge.lockedValue;
        } else {
            // 📈 Price increased → calculate new value
            payout = (hedge.amount * currentPrice) / 1e18;
        }
        // 🛡 Safety: ensure contract has enough balance
        uint256 contractBalance = usdt.balanceOf(address(this));
        if (payout > contractBalance) {
            payout = contractBalance;
        }
        require(usdt.transfer(hedge.owner, payout), "Payout failed");
        emit HedgeClosed(id, hedge.owner, currentPrice, payout);
    }

    function getUserPositions(address user) external view returns (uint256[] memory) {
        return userPositions[user];
    }

    function totalPositions() external view returns (uint256) {
        return positions.length;
    }
}
