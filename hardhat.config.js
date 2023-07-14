require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//const privateKey = process.env.PRIVATE_KEY_CONTRACTS_EXECUTOR || "";
const privateKey = process.env.PRIVATE_KEY_CONTRACTS_SPONSOR || "";
const RPC = process.env.ETHEREUM_RPC_URL || "";
const RPC_AVAX = process.env.AVAX_RPC_TESTNET || "";

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: RPC,
      accounts: [`0x${privateKey}`],
    },
    fuji: {
      url: RPC_AVAX,
      accounts: [`0x${privateKey}`],
    },
    dega: {
      url: "https://ddevtesting.com/ext/bc/2g8uCq851q1gdXxQeSZMpozmiFkjoD2fDFv6uPmfCmqTJQ6L6a/rpc",
      accounts: [`0x${privateKey}`],
    },
  },
};
