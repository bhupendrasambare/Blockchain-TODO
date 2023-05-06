require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  paths:{
    artifacts:"./client/src/utils/artifacts"
  },
  networks:{
    hardhat:{
      chainId:1337,
    }
  }
};
