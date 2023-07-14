import {
  AddBurnNftTxPayload,
  TxResponse,
  NftMintType,
} from '../../schema/generated'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI';
import {
  DYNAMIC_NFT_ABI,
  BASE_NFT_ABI,
  INMUTABLE_NFT_ABI
} from '../../constants/abis';
import { findTxHash } from "../../util";
import { createTransactionBurn } from '../txLogger';
import { PostBurnNftTxPayload } from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';


const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

export const burnNft = async ({
  tokenId,
  contractAddress,
  type,
  
}: AddBurnNftTxPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')
// Validar la dirección Ethereum 'contractAddress'
const errors: any = {};
if (!isValidAddress(contractAddress)) {
  errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
}
if (Object.keys(errors).length > 0) {
  throw new Error(JSON.stringify(errors));
}

  const value = tokenId * 1e4;
  const args = {
    [NftMintType.Dynamic]: [tokenId],
    [NftMintType.Base]: [tokenId],
    [NftMintType.Immutable]: [tokenId]
  }

  const loggerPayload: PostBurnNftTxPayload = {    
    tokenId: tokenId,
    contractAddress: contractAddress,
    type: type,    
  };

  let txStatus = 0;
  let txId = ''  
  
  const contract = new ethers.Contract(contractAddress, abis[type])

  try {
    const result = await contract.connect(gsnSigner).burn(...args[type])

    if (result) {      
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);      

      //Udpdate the graph
      const updateLoggerPayload: PostBurnNftTxPayload = {  
        id: txId,
        decodeData: [],
        confirm: 1,  
        message: 'Tx confirmed',    
        tokenId: tokenId,
        contractAddress: contractAddress,
        type: type,        
      };

      await createTransactionBurn(updateLoggerPayload);

      txStatus = 1;

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
