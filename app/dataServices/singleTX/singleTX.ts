import { RelayProvider, NpmLogLevel } from '@opengsn/provider';
import { GAS_LIMIT } from "../../constants/txUtil";
import { getProvider } from "../providerConfig";
import { TxResponse } from "../../schema/generated";
import { ethers, Contract, Wallet } from 'ethers';
import { TEST_ABI } from './abis';
//import Web3HttpProvider from "web3-providers-http";
import Web3 from 'web3';
const Web3HttpProvider = require('web3-providers-http');

const paymasterAddress = "0x0c9aEe3F75378f010CF05043fEaf9999dd849312";


const privateKey = "5f909dc97e4139054b8c74dddfbe0de3b08d493b26450da12904c77eaf3b0f59";
const ramdomAddress = "0x31dF5b8C8D1929a865263d83e07293D981EFc225";
const accountAddress = "0xbfA8e2A66B64420CCcF7fd95506F51E23dDcf03e";
const privateKeyRandomAddress = "0f3f13f8412738b69c8030d38ed16dd3de368df5451d53157c1e23da13a2ac86";

async function getGSNProvider(ethereumNodeUrl: string) {

  const logType: NpmLogLevel = "debug";


  const config = {
    paymasterAddress: paymasterAddress,
    gasPriceFactorPercent: 10,
    maxViewableGasLimit: "1465750000000000000",
    preferredRelays: ["https://degarelay.com"],
    performDryRunViewRelayCall: false,
    loggerConfiguration: {
      logLevel: logType
    }
  }

  const web3provider = new Web3HttpProvider(ethereumNodeUrl);

  const provider = await RelayProvider.newProvider({ provider: web3provider, config }).init();
  console.log("provider", provider.host, provider.relayClient.config);
  return provider;
}

export const singleTX = async ({
  walletPrivateKey,
  contractAddress,
  from,
  to,
}: {
  walletPrivateKey: string;
  contractAddress: string;
  from: string;
  to: string;
}): Promise<TxResponse> => {

  const address = "0x58464C437f6A6229BfFa48AaDE5FD6C0108bc694";
  const providerMetaData = getProvider("flashbot");
  const { chainId, ethereumNodeUrl } = providerMetaData;
  const abi = TEST_ABI as any;

  const gsnProvider: any = await getGSNProvider(ethereumNodeUrl);
  await gsnProvider.addAccount(privateKeyRandomAddress)
  const fromT = gsnProvider.newAccount().address;

  const web3 = new Web3(gsnProvider);

  const etherProvider = new ethers.providers.Web3Provider(gsnProvider);

  const myRecipient = new web3.eth.Contract(abi, address);

  const signerMock = new Wallet(privateKey, etherProvider);

  const gsnSigner = await etherProvider.getSigner(ramdomAddress);

  const contract = getFactoryContract(address, TEST_ABI);
  const tx = await contract.connect(gsnSigner).safeMint(ramdomAddress, 2, "uriXD");
  console.log("TX", {tx});

  /*const contract = new Contract(
    address,
    TEST_ABI,
    signerMock
  );*/

  //const result = await myRecipient.methods.safeMint(ramdomAddress, 2, "uriXD").send({ from: from, gasLimit: 25000 });
  /*const result = await contractConnect.safeMint(ramdomAddress, 2, "uriXD", {
    gasLimit: 25000,
  });*/



  return {
    txId: "",
    txStatus: 0,
  };
};

function getFactoryContract(address: string, abi: any) {
  const contract = new ethers.Contract(address, abi);
  return contract;
}

