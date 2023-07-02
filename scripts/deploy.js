const hre = require("hardhat");

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  async function main() {
    const donation = await  hre.ethers.getContractFactory("TaskContract");
    const contract = await donation.deploy();

    await contract.deployed();
    console.log("Address of contract "+contract.address);
}