const axios = require("axios");
require("dotenv").config();

const RPC = process.env.ETHEREUM_RPC_URL || "";

// TIMEPieces contract address
const address = "0x96f95f49bc986e1c0d538c04ffc05dcf8fceb670";

// Safe Haven Token ID
const tokenId = 1;

const url = `${RPC}?address=${address}&tokenId=${tokenId}`;

const config = {
  method: "get",
  url: url,
};

axios(config)
  .then((response) => console.log(response.data))
  .catch((error) => console.log(error));
