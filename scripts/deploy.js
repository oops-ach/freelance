import hre from "hardhat";

async function main() {
  console.log("Starting deployment...\n");

  // 1. Deploy FreelanceToken
  console.log("Deploying FreelanceToken...");
  const FreelanceToken = await hre.ethers.getContractFactory("FreelanceToken");
  const token = await FreelanceToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("FreelanceToken deployed to:", tokenAddress);

  // 2. Deploy FreelanceMarketplace
  console.log("\nDeploying FreelanceMarketplace...");
  const FreelanceMarketplace = await hre.ethers.getContractFactory("FreelanceMarketplace");
  const marketplace = await FreelanceMarketplace.deploy(tokenAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("FreelanceMarketplace deployed to:", marketplaceAddress);

  // 3. Transfer ownership so Marketplace can mint rewards
  console.log("\nTransferring token ownership to marketplace...");
  // This requires FreelanceToken to inherit "Ownable"
  await token.transferOwnership(marketplaceAddress);
  console.log("Token ownership transferred!");

  console.log("\n=== Deployment Complete ===");
  console.log("FreelanceToken Address:", tokenAddress);
  console.log("FreelanceMarketplace Address:", marketplaceAddress);
  console.log("\nSave these addresses for your frontend configuration!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});