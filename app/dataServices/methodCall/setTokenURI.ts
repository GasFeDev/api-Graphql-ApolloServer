import {
  TxResponse,
  NftMintType,
} from '../../schema/generated'
import { DYNAMIC_NFT_ABI, BASE_NFT_ABI,} from '../../constants/abis';
import { ethers } from 'ethers';
import { getGSNProvider } from '../../providerAPI';
import { createSetTokenUri} from '../txLogger/method';
import { findTxHash } from "../../util";
import { PostMethodCallPayload} from '../txLogger/interfaces';

const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,

}
const allMethods = ['setTokenURI'];

export const setTokenURICall = async (
  args: any[],
  tokenAddress: string,
  method: string,
  _tokenId: number,
  _tokenURI: string,
  _tokenOwnerSign: number,
  ): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')
  
  let selectedAbi = DYNAMIC_NFT_ABI; // Use DYNAMIC_NFT_ABI as default ABI
  switch (method) {
    case allMethods[0]:
      selectedAbi = abis[NftMintType.Dynamic];
      break;
    case allMethods[1]:
      selectedAbi = abis[NftMintType.Base];
      break;
    default:
      throw new Error(`Invalid method "${method}" for contract address ${tokenAddress}`);

  }

  let txStatus = 0;
  let txId = '';

  const contract = new ethers.Contract(tokenAddress, selectedAbi);

  try {
    const result = await contract.connect(gsnSigner)[method]?.(...args);
    console.log("result===>", result);
    if (result) {
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);

      const updateLoggerPayload: PostMethodCallPayload = {
        id: txId,
        decodeData: [],
        confirm: 1,
        message: "TX confirmed",
        _tokenId: _tokenId,
        _tokenURI: _tokenURI,
        _tokenOwnerSign: _tokenOwnerSign,
        contractAddress: tokenAddress};

      await createSetTokenUri(updateLoggerPayload);

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