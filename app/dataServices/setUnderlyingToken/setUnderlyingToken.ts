import { SetUnderlyingTokenPayload } from './../../schema/generated';
import { findTxHash } from "../../util";
import {
  TxResponse,
} from '../../schema/generated'
import { TX_ZERO, TX_DESCRIPTION, SET_UNDERYING_TOKEN } from '../../constants/txTypes'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI'
import {
  LOCK_NFT_ABI,
} from '../../constants/abis'
import { sendNewTransaction, updateTransaction } from '../txLogger';
import { UpdateLoggerTXPayload, PostLoggerTXPayload } from '../txLogger/interfaces';

export const setUnderlyingToken = async ({
  contractAddress,
  isERC20,
  underlyingToken,
}: SetUnderlyingTokenPayload): Promise<TxResponse> => {
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
    propertiesValues: [],
    rawSimulationTx: "",
    svgProperty: "",
    symbol: "",
    to: "",
    amount: 0,
    tokenId: 0,
    isERC20: isERC20,
    tokenNFTAddress: underlyingToken,
    txHash: TX_ZERO,
    txType: SET_UNDERYING_TOKEN,
  };
  //send TX to Dgraph
  const dGraphTx = await sendNewTransaction(loggerPayload);

  let txStatus = 0;
  const txId = dGraphTx?.id || ''
  const contract = new ethers.Contract(contractAddress, LOCK_NFT_ABI);

  try {

    const result = await contract
      .connect(gsnSigner)
      .setUnderlyingToken(underlyingToken, isERC20);

    //  console.log('result==>', result)

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
        isERC20: isERC20,
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
    txStatus: 1,
  }
}
