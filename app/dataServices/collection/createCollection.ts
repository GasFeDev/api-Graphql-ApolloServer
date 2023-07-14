import { CreateCollectionPayload, TxResponse, NftMintType, } from '../../schema/generated';
import { sendNewTransaction, updateTransaction, payloadBuilder } from '../txLogger';
import { getGSNProvider } from '../../providerAPI';
import {
  CREATE_COLLECTION,
  TX_ZERO,
  TX_DESCRIPTION,
} from '../../constants/txTypes';
import { decoder, findTxHash } from "../../util";
import { CREATE_COLLECTION_LOG } from "../../constants/txUtil";
import { ethers } from 'ethers';
import { DEGA_FACTORY_ABI } from '../../constants/abis';
import { UpdateLoggerTXPayload, PostLoggerTXPayload } from '../txLogger/interfaces';

export const createCollection = async (
  collectionPayload: CreateCollectionPayload
): Promise<TxResponse> => {
  const { name, symbol, contractUri, maxSupply, collectionOwner, baseUri, isOnChainMD, ntfType } =
    collectionPayload;

  const { factoryAddress, gsnSigner } = await getGSNProvider('dega');

  const nftTypeArg = ntfType === 0 ? NftMintType.Dynamic : ntfType === 1 ? NftMintType.Base : NftMintType.Immutable

  const data: PostLoggerTXPayload = payloadBuilder({
    baseUri: baseUri,
    contractUri: contractUri,
    description: TX_DESCRIPTION,
    isOnChainMD: isOnChainMD,
    maxSupply: maxSupply,
    name: name,
    nftType: nftTypeArg,
    owner: collectionOwner,
    symbol: symbol,
    to: factoryAddress,
    txHash: TX_ZERO,
    txType: CREATE_COLLECTION,
  });

  //send TX to Dgraph
  const dGraphTx = await sendNewTransaction(data);
  let txStatus = 0
  const txId = dGraphTx?.id || '';
  const contract = new ethers.Contract(factoryAddress, DEGA_FACTORY_ABI);

  try {
    const result = await contract
      .connect(gsnSigner)
      .createNFTContract(
        name,
        symbol,
        contractUri,
        baseUri,
        isOnChainMD,
        maxSupply,
        collectionOwner,
        ntfType
      )

    if (result) {
      txStatus = 1;
      //find the result 
      const data = await result.wait();
      const decodedData = decoder(data, CREATE_COLLECTION_LOG);
      const txHash = findTxHash(0, data?.logs);
      //Udpdate the graph
      const updateLoggerPayload: UpdateLoggerTXPayload = {
        id: txId,
        txHash: txHash,
        decodeData: decodedData,
        contractAddress: decodedData[1],
        message: "TX confirmed",
        confirm: 1,
      };

      await updateTransaction(updateLoggerPayload);

      return {
        txId,
        txStatus: txStatus,
        txHash: txHash,
        txRawResult: data,
        decodeData: decodedData
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
