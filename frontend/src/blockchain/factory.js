import { ethers } from "ethers";

// 🔥 MUST MATCH YOUR DEPLOYED CONTRACT
const factoryAddress = "0x86DC57f2EE1F00c6e66d0833E210693FfCf92893"; // sepolia
// -----------------------------
// FACTORY ABI (CLEAN + CONSISTENT)
// -----------------------------
const factoryABI = [
  // create new song contract
  "function createSong(address[] payees,uint256[] shares,string title) returns (address)",

  // 🔥 PUSH MODEL: send ETH + auto split
  "function distributeRoyalties(address[] payees,uint256[] shares) payable",

  // view all songs
  "function getSongs() view returns (tuple(address contractAddress,string title)[])",

  // optional analytics (ONLY if you implemented it in Solidity)
  "function getTotalSent(address user) view returns (uint256)",

  // events
  "event SongCreated(address indexed contractAddress, string title)",
  "event RoyaltiesDistributed(address indexed sender, uint256 totalAmount)"
];

// -----------------------------
// CONTRACT FACTORY HELPER
// -----------------------------
export function getFactoryContract(signerOrProvider) {
  return new ethers.Contract(factoryAddress, factoryABI, signerOrProvider);
}