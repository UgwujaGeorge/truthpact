const hre = require("hardhat");

async function main() {
  const truthPact = await hre.ethers.deployContract("TruthPact");
  await truthPact.waitForDeployment();

  const address = await truthPact.getAddress();

  console.log("TruthPact deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
