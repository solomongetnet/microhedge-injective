import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy ERC20 token
  const CreditCoinDemo = await ethers.getContractFactory("CreditCoinDemo");
  const cCTC = await CreditCoinDemo.deploy();
  await cCTC.waitForDeployment();
  const cCTCAddress = await cCTC.getAddress();
  console.log("CreditCoinDemo deployed to:", cCTCAddress);

  // Deploy Loan Contract
  const GFCPLoan = await ethers.getContractFactory("GFCPLoan");
  const loanContract = await GFCPLoan.deploy(cCTCAddress);
  await loanContract.waitForDeployment();
  const loanContractAddress = await loanContract.getAddress();
  console.log("GFCPLoan deployed to:", loanContractAddress);

  // Mint initial supply of cCTC to deployer (50,000 cCTC)
  const initialMintBase = "50000";
  const initialMint = ethers.parseUnits(initialMintBase, 18);
  const mintTx = await cCTC.mint(deployer.address, initialMint);
  await mintTx.wait();
  console.log(`Minted ${initialMintBase} cCTC to deployer`);

  // Fund Loan pool with 25,000 cCTC
  const fundPoolBase = "25000";
  const fundPoolAmount = ethers.parseUnits(fundPoolBase, 18);
  const transferTx = await cCTC.transfer(loanContractAddress, fundPoolAmount);
  await transferTx.wait();
  console.log(`Funded Loan Pool with ${fundPoolBase} cCTC`);

  console.log("\nSetup Complete!");
  console.log("------------------------");
  console.log("CreditCoinDemo (cCTC):", cCTCAddress);
  console.log("GFCPLoan:", loanContractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
