import {
  AddTransferNftPayload,
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
import { createTransactionTransferNFT} from '../txLogger';
import {  PosttransferNftTxPayload } from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';


const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

export const transferNft = async ({
  contractAddress,
  from,
  tokenId,
  to,
  type,
  
}: AddTransferNftPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')
    // Validar la dirección Ethereum 'to, from anda contractAddress'
    const errors: any = {};
    if (!isValidAddress(to)) {
      errors.to = `Please use an Ethereum address, the wallet address ${to} is invalid.`;
    }
    if (!isValidAddress(from)) {
      errors.from = `Please use an Ethereum address, the wallet address ${from} is invalid.`;
    }
    if (!isValidAddress(contractAddress)) {
      errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
    }
  
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

  const value = tokenId * 1e4;
  const args = {
    [NftMintType.Dynamic]: [from, to, tokenId],
    [NftMintType.Base]: [from, to, tokenId],
    [NftMintType.Immutable]: [from, to, tokenId]
  }

  let txStatus = 0;
  let txId = '';

  const contract = new ethers.Contract(contractAddress, abis[type])

  try {
   
    const result = await contract.connect(gsnSigner).transferFrom(...args[type])

    if (result) {
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);

      const updateLoggerPayload: PosttransferNftTxPayload = {
        id: txId,
        decodeData: [],
        contractAddress: contractAddress,
        confirm: 1,
        message: "TX confirmed",
        tokenId: tokenId,
        to: to,
        type: type,
        from: from
      };

      await createTransactionTransferNFT (updateLoggerPayload);

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
