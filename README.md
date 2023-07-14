# GASFEDEV API

## Commands

### Run

Use the following command `npm run dev`

### Generate schemas

Use the following command `npm run build:gql` will automatically generate a typescripts graphql dependencies

### Generate code build

Use the following command `npm run build` will automatically build the tsc code, then you can use ` npm run start:prod` to start the server.

### Test files

You can use the following command to run test files

`npm run test:jest --testPatternPath path/to/test/testName.test.ts`

### Linting

You can use the following command to fix lint issues : `lint:fix` and for schema.graphql `lint:gql`

## Contracts

All contracts are currently deployed in the Goerli Testnet

- NFT contract Sponsor: 0x395Edb4F93e814C670dCeCfE538B2F3aFA54130c
- NFT contract Executor: 0x5AF03570e2B23A5b7b5932a10F3c446FfBF1d4E5, 0xECCF9fffe26eA7847e894d3e407233Fce5879B21
- NFT DD Sponsor: 0x74442Eaeac24DcaA55DEcC96b9b00CEE1b8E2515
- - IDS : 100-10 , 1234567891011121314151617181920
- ERC20 contract Sponsor(DDCoinERC20 , 10000 suply): 0x12e605bf3bA87C49875477eA1b535C17308523e4
- ERC20 DDeD20 Token : 0xa4f0bE8ADf3b2f46Ecbe49dcde858eC63783A7Cb , creted by : 0xbfA8e2A66B64420CCcF7fd95506F51E23dDcf03e
- ERC20 BurnT Token : 0x93E670AE46B71a943B1331D2bd9624F25b36fDf0 , creted by : 0xbfA8e2A66B64420CCcF7fd95506F51E23dDcf03e
- ERC721 DegaNFT: 0xFf29E8880D4C7764f9a414560acC87f75216d939, created by : 0x31dF5b8C8D1929a865263d83e07293D981EFc225

### Hardhat deploy

Use the folling command to deploy

`npx hardhat run --network goerli scripts/scriptName.js`

### Factory reference

- Contract: 0x2a2BD75eFF32b601D360A10fE83a2cc5A61543bb
- New contract supports set ownership: 0x96F95f49BC986e1c0D538c04ffC05dcF8Fceb670

## GCP Cloud Run

We use CI/CD to deploy this application using docker and cloud run on GCP, url of deployment:

- Cloud Run: https://dega-api-dev-brew5y634a-uc.a.run.app
- Run Docker : docker run --publish 8080:8080 degaapi

## Services

You can call services using POST man or any other http client, services involve Sponsor, Executor and recipent(not in all services) accounts.

- Sponsor: Is the account that is going to pay for the transaction
- Executor: Is the account how is going to execute the action.
- Recipent: Not in all escenarios , but is the account that is going to recieve the transactions.

### transferERC20

This services is to transfer an ERC20 from Executor account to the recipient account, the transactions is payed by the sponsor account.
Request:

```
query transferERC20TX($payload: SponsorPayload!) {
  transferERC20(payload: {
    to: "0x10a8350457bf0022952D397Be51F9d84a1a95Bb4"
    value: 10
    description: "This is a description"
    gasPrice: 50000
    gasLimit: 50000
    executor: "PRIVATE_KEY"
    sponsor: "PRIVATE_KEY"
    tokenAddress:"0x82B684e625ea79e96D31908Eb05Ac1E1c6bc54E3"
  }) {
    txStatus
  }
}
```

Response:

```
{
  "data": {
    "transferERC20": {
      "txStatus": 0
    }
  }
}
```

### transferERC721

This services is to transfer an ERC721 from Executor account to the recipient account, the transactions is payed by the sponsor account.

Request:

```
query transferNFTTX($payload: SponsorPayload!) {
  transferERC721(payload: {
    to: "0x10a8350457bf0022952D397Be51F9d84a1a95Bb4"
    value: 10
    description: "This is a description"
    gasPrice: 50000
    gasLimit: 50000
    executor: "PRIVATE_KEY"
    sponsor: "PRIVATE_KEY"
    contractAddress:"0xECCF9fffe26eA7847e894d3e407233Fce5879B21"
    tokenID: 1
  }) {
    txStatus
  }
}

```

Response

```
{
  "data": {
    "transferERC721": {
      "txStatus": 0
    }
  }
}
```

### mintNFT

This services is for minting and NFT from Executor account, the transactions is payed by the sponsor account.

Request:

```
query MintNFT($payload: MintNftTXPayload!) {
  mintNFT(payload: {
    executor: "PRIVATE_KEY"
    sponsor: "PRIVATE_KEY"
    tokenAddress: "0x48c35Ab85338D27e6DA7c1831356ab67B0464e5e"
    baseUri: "https://fiwork.mypinata.cloud/ipfs/QmRRHkswPmxTjpGcZZX2VGS8FMmQR2ix8YeYULP6QJq2YT/"
    tokenId: 25
  }) {
    txStatus
  }
}
```

Response

```
{
  "data": {
    "mintNFT": {
      "txStatus": 0
    }
  }
}
```

### mint ERC20

This services is for minting and ERC20 from Executor account, the transactions is payed by the sponsor account.

Request:

```
query MintNFT($payload: MintNftTXPayload!) {
  mintNFT(payload: {
    executor: "PRIVATE_KEY"
    sponsor: "PRIVATE_KEY"
    contractAddress: "0x93E670AE46B71a943B1331D2bd9624F25b36fDf0",
    amount: 1000000
    data:"0x1249c58b"
  }) {
    txStatus
  }
}
```

Response

```
{
  "data": {
    "mintERC20": {
      "txStatus": 0
    }
  }
}
```

### CreateCollection

Request:

```
mutation CreateCollection{
  createCollection(
    input: {
      executor: "PRIVATE_KEY"
      sponsor: "PRIVATE_KEY",
      collectionOwner: "0x31dF5b8C8D1929a865263d83e07293D981EFc225",
      contractUri: "uriParam"
      isMintLimitEnabled: false,
      name: "DDTESTMorning"
      mintLimitItems: 1
      symbol: "DDTESTMorning"
      onChainMetadata: false,
      isDynamic: false
    }
  ) {
    txResponse {
      txStatus
    }
    address
    collectionOwner

  }
}
```

Response

```
{
  "data": {
    "transferERC20": {
      "txStatus": 0
    }
  }
}
```

### MintCollection

Request:

```
mutation MintCollection{
  mintCollection(
    input: {
      executor: "PRIVATE_KEY"
      sponsor: "PRIVATE_KEY",
      address: "XYZ",
      tokenUri: "XYZ",
      tokenAddress: "uriParam",
      collectionAddress: "0x31dF5b8C8D1929a865263d83e07293D981EFc225",
    }
  ) {
    txResponse {
      txStatus
    }
    address
    collectionOwner

  }
}
```

Response

```
{
  "data": {
    "transferERC20": {
      "txStatus": 0
    }
  }
}
```

### SigleTX

Request:

```
query SingleTX($payload: SingleTXPayload!) {
  singleTX(payload: {
    walletPrivateKey: "PRIVATE_KEY"
    contractAddress: "0x36b2A537ad11c815b51Bd25E2DbC8213D84A4959"
  }) {
    txStatus
  }
}
```

Response

```
{
  "data": {
    "transferERC20": {
      "txStatus": 0
    }
  }
}

```

## Create ERC20

This services will create a ERC20 from the Executor account, the transactions is payed by the Sponsor account.

Request:

```
mutation CreateErc20{
  createERC20(
    input: {
      executor: "PRIVATE_KEY"
      sponsor: "PRIVATE_KEY",
      name: "KY Coin",
      symbol: "KY"
      supply: 80000000000000000
      decimals: 16
    }
  ) {
    txHash
    txResponse {
      txId
      txStatus
    }
    address
    collectionOwner

  }
}
```

Response

```
{
  "data": {
    "createERC20": {
      "txHash": "0x88105e60035a9e1b4bbda09bdb6abda862c4a997ab24380a0f6c9933938a174c",
      "txResponse": {
        "txId": "0xfffd8d6aba90c5c9",
        "txStatus": 1
      },
      "address": "0xE0900F7e2A89619575A8286456Dea8b0Ff40096C",
      "collectionOwner": null
    }
  }
}
```

## Burn ERC20

This services will burn ERC20 from the Executor account, the transactions is payed by the Sponsor account, make sure that executor account has founds.

Request:

```
mutation BurnERC20($input: BurnERC20!){
  burnERC20(
    input: {
      executor: "PRIVATE_KEY"
      sponsor: "PRIVATE_KEY"
      contractAddress: "0x93E670AE46B71a943B1331D2bd9624F25b36fDf0",
      amount: 1000000
    }
  ) {
    txStatus
    message
  }
}

```

Response

```
{
  "data": {
    "burnERC20": {
      "txStatus": 0,
      "message": null
    }
  }
}
```

## Burn ERC721

This services will burn ERC721 from the Executor account, the transactions is payed by the Sponsor account, make sure that executor account is the owner of the NFT

Request:

```
mutation BurnERC721($input: BurnERC721!){
  burnERC721(
    input: {
      executor: "PRIVATE_KEY"
      sponsor: "PRIVATE_KEY",
      contractAddress: "0xFf29E8880D4C7764f9a414560acC87f75216d939",
      tokenId: 2
    }
  ) {
    txStatus
    message
  }
}
```

Response:

```
{
  "data": {
    "burnERC721": {
      "txStatus": 0,
      "message": null
    }
  }
}
```

### Testing of existing services

## transferERC20

# Operation

mutation TransferERC20TX {
transferERC20 (
input: {
from: ""
to: ""
amount: 10
tokenAddress:""
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}

# Response (STATUS 200)

{
"data": {
"transferERC20": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message": ""
"txHash":
"txId": "",
"txRawResult":
"txStatus":
}
}
}

## transferNFTTX

# Operation

mutation transferNFTTX {
transferERC721 (
input: {
from: ""
to: ""
contractAddress: ""
tokenId:1
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}
}

# Response (STATUS 200)

{
"data": {
"transferERC721": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message":
"txHash":
"txId": ""
"txRawResult":
"txStatus":
}
}
}

## mintNFT

# Operation

mutation MintNFT {
mintNFT (
input: {
to: ""
tokenAddress: ""
baseUri: ""
tokenId: 55
type: DYNAMIC
erc20ContractAddress: ""
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}
}
}

# Response (STATUS 200)

{
"data": {
"mintNFT": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message":
"txHash":
"txId": ""
"txRawResult":
"txStatus":
}
}
}

## MintERC20

# Operation

mutation MintERC20 {
mintERC20 (
input: {
to: ""
amount: 10
contractAddress: ""
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}
}

# Response (STATUS 200)

{
"data": {
"mintERC20": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message":
"txHash":
"txId": ""
"txRawResult":
"txStatus":
}
}
}

## CreateCollection

# Operation

mutation CreateCollection {
createCollection (
input: {
collectionOwner: ""
contractUri: ""
baseUri: ""
isOnChainMD: false
name: ""
symbol: ""
maxSupply: 10
ntfType: 0
}
) {
\_\_typename
address
collectionOwner
errors
txHash
}
}

# Response (STATUS 200)

{
"data": {
"createCollection": {
"\_\_typename": "CreateTxResponse",
"address": ""
"collectionOwner": ""
"errors": []
"txHash":
}
}
}

## BurnERC20

# Operation

mutation BurnERC20 {
burnERC20 (
input: {
amount: 10
contractAddress: ""
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}
}

# Response (STATUS 200)

{
"data": {
"burnERC20": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message":
"txHash":
"txId": ""
"txRawResult":
"txStatus":
}
}
}

## BurnERC721

# Operation

mutation BurnERC721 {
burnERC721 (
input: {
tokenId:"2"
contractAddress: ""
}
) {
\_\_typename
decodeData
errors
message
txHash
txId
txRawResult
txStatus
}
}
}

# Response (STATUS 200)

{
"data": {
"burnERC721": {
"\_\_typename": "TXResponse",
"decodeData":
"errors":
"message":
"txHash":
"txId": ""
"txRawResult":
"txStatus":
}
}
}
