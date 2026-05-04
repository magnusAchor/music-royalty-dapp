// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RoyaltySplitter {

    string public songTitle;
    address public factory;

    address[] private payees;
    uint256[] private shares; // percentages (must sum to 100)

    uint256 public totalReceived;

    event RoyaltyReceived(address indexed from, uint256 amount);
    event RoyaltyDistributed(uint256 totalAmount);

    constructor(
        address[] memory payees_,
        uint256[] memory shares_,
        string memory _title,
        address _factory
    ) {
        require(payees_.length == shares_.length, "Mismatch arrays");

        songTitle = _title;
        factory = _factory;

        payees = payees_;
        shares = shares_;
    }

    // -----------------------------
    // RECEIVE ETH INTO CONTRACT
    // -----------------------------
    receive() external payable {
        totalReceived += msg.value;
        emit RoyaltyReceived(msg.sender, msg.value);
    }

    // -----------------------------
    // MAIN FEATURE: PUSH DISTRIBUTION
    // -----------------------------
    function distributeRoyalties() external payable {
        require(msg.value > 0, "No ETH sent");

        uint256 total = msg.value;

        for (uint i = 0; i < payees.length; i++) {
            uint256 amount = (total * shares[i]) / 100;

            (bool success, ) = payable(payees[i]).call{value: amount}("");
            require(success, "Transfer failed");
        }

        emit RoyaltyDistributed(total);
    }

    // -----------------------------
    // FRONTEND HELPERS
    // -----------------------------
    function getPayees() external view returns (address[] memory) {
        return payees;
    }

    function getShares() external view returns (uint256[] memory) {
        return shares;
    }

    function getTotalReceived() external view returns (uint256) {
        return totalReceived;
    }
}