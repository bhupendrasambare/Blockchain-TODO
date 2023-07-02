require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  solidity: "0.8.4",
  paths:{
    artifacts:"./client/src/utils/artifacts"
  },
  networks:{
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY]
    },
  },
};

// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.4",
//   paths:{
//     artifacts:"./client/src/utils/artifacts"
//   },
//   networks:{
//     hardhat:{
//       chainId:1337,
//     }
//   }
// };

