const { ContractFactory } = require("ethers");
const hre = require("hardhat");

const main = async() => {
  const contractFactory = await hre.ethers.getContractFactory("TaskContract");
  const contract = await contractFactory.deploy();
  await contract.deployed();
  
  console.log("contract deployed at "+ contract.address);
};

const runMain = async()=>{
  try{
    await main();
    process.exit(0)
  }catch(error){
    console.log(error);
    process.exit(-1)
  }
}

runMain();