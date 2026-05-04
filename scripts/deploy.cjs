const hre = require("hardhat");

async function main() {
  const Factory = await hre.ethers.getContractFactory("RoyaltyFactory");

  const factory = await Factory.deploy();

  // ✅ correct for Hardhat (works in both v5/v6 setups)
  await factory.deployed();

  console.log("Factory deployed to:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});