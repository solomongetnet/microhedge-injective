const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const CharapiaNft = await hre.ethers.getContractFactory("CharapiaNft");

  // base URI and mint price
  const baseURI = "ipfs://QmYourCIDHere/";
  const mintPrice = hre.ethers.utils.parseEther("0.01"); // 0.01 ETH

  const nft = await CharapiaNft.deploy(baseURI, mintPrice);
  await nft.deployed();

  console.log("Charapia NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
