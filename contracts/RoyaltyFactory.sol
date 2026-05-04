// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RoyaltySplitter.sol";

contract RoyaltyFactory {

    struct Song {
        address contractAddress;
        string title;
    }

    Song[] public songs;

    // 🔥 Track total ETH sent by each wallet
    mapping(address => uint256) public totalSent;

    event SongCreated(address indexed contractAddress, string title);

    event RoyaltiesDistributed(
        address indexed sender,
        uint256 totalAmount
    );

    // -----------------------------
    // CREATE SONG
    // -----------------------------
    function createSong(
        address[] memory payees,
        uint256[] memory shares,
        string memory title
    ) external returns (address) {

        RoyaltySplitter splitter = new RoyaltySplitter(
            payees,
            shares,
            title,
            address(this)
        );

        songs.push(Song({
            contractAddress: address(splitter),
            title: title
        }));

        emit SongCreated(address(splitter), title);

        return address(splitter);
    }

    // -----------------------------
    // DISTRIBUTE ROYALTIES (FIXED)
    // -----------------------------
    function distributeRoyalties(
        address[] memory payees,
        uint256[] memory shares
    ) external payable {

        require(msg.value > 0, "No ETH sent");
        require(payees.length == shares.length, "Invalid input");

        uint256 totalShare = 0;

        // validate + sum shares
        for (uint i = 0; i < shares.length; i++) {
            totalShare += shares[i];
            require(payees[i] != address(0), "Invalid payee");
        }

        require(totalShare == 100, "Shares must equal 100%");

        uint256 total = msg.value;

        // -----------------------------
        // SAFE DISTRIBUTION (call instead of transfer)
        // -----------------------------
        for (uint i = 0; i < payees.length; i++) {

            uint256 amount = (total * shares[i]) / 100;

            (bool success, ) = payable(payees[i]).call{value: amount}("");
            require(success, "ETH transfer failed");
        }

        totalSent[msg.sender] += total;

        emit RoyaltiesDistributed(msg.sender, total);
    }

    // -----------------------------
    // GET TOTAL SENT BY WALLET
    // -----------------------------
    function getTotalSent(address user) external view returns (uint256) {
        return totalSent[user];
    }

    // -----------------------------
    // GET ALL SONGS
    // -----------------------------
    function getSongs() external view returns (Song[] memory) {
        return songs;
    }
}