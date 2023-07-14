import {
  TX_BURN_ERC721,
  TX_ZERO,
  TX_DESCRIPTION,
} from '../../constants/txTypes'
import { BurnErc721, TxResponse } from '../../schema/generated'
import { getGSNProvider } from '../../providerAPI'
import { ERC721_ABI } from '../../constants/abis'
import { ethers } from 'ethers'
import {
  sendNewTransaction,
  updateTransaction,
} from '../txLogger';
import { findTxHash } from '../../util';
import { UpdateLoggerTXPayload, PostLoggerTXPayload } from '../txLogger/interfaces';

export const burnERC721 = async ({
  contractAddress,
  tokenId,
}: BurnErc721): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')


  const loggerPayload: PostLoggerTXPayload = {
    baseUri: "",
    confirm: 0,
    contractAddress: contractAddress,
    contractUri: "",
    decodeData: [],
    errors: "",
    description: TX_DESCRIPTION,
    from: "",
    isOnChainMD: false,
    maxSupply: 0,
    message: "",
    name: "",
    nftType: "",
    owner: "",
    propertiesName: [],
    isERC20: false,
    propertiesValues: [],
    rawSimulationTx: "",
    svgProperty: "",
    symbol: "",
    to: "",
    amount: 0,
    tokenId: tokenId,
    tokenNFTAddress: contractAddress,
    txHash: TX_ZERO,
    txType: TX_BURN_ERC721,
  };
  //send TX to Dgraph
  const dGraphTx = await sendNewTransaction(loggerPayload);

  let txStatus = 0;
  const txId = dGraphTx?.id || '';
  const contract = new ethers.Contract(contractAddress, ERC721_ABI);

  try {
    const result = await contract
      .connect(gsnSigner)
      .burn(tokenId)

    console.log('result==>', result);

    if (result) {
      txStatus = 1;
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);
      //Udpdate the graph
      const updateLoggerPayload: UpdateLoggerTXPayload = {
        id: txId,
        txHash: txHash,
        decodeData: [],
        contractAddress: contractAddress,
        confirm: 1,
        message: "TX confirmed",
        amount: 0,
        isERC20: false,
        propertiesName: [],
        propertiesValues: [],
      };

      await updateTransaction(updateLoggerPayload);

      return {
        txId,
        txStatus: txStatus,
        txRawResult: data,
        txHash: txHash,
        decodeData: []
      }
    }

  } catch (e) {
    console.log("err: ", e);
    return {
      txId,
      txStatus: 0,
    }

  }

  return {
    txId,
    txStatus: txStatus,
  }
}
