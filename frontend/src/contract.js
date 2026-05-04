import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ABI = [
  "function songTitle() view returns (string)",
  "function totalShares() view returns (uint256)",
  "function shares(address) view returns (uint256)",
  "function releasable(address) view returns (uint256)",
  "function release(address)"
];

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
};