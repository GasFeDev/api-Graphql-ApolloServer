import { TxResponse, NftMintType } from '../../schema/generated'
import { DYNAMIC_NFT_ABI, BASE_NFT_ABI, INMUTABLE_NFT_ABI } from '../../constants/abis';
import { ethers } from 'ethers';
import { getGSNProvider } from '../../providerAPI';
import { createSetTrustedForwarder } from '../txLogger/method';
import { findTxHash } from "../../util";
import { PostMethodCallPayload } from '../txLogger/interfaces';

const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

const allMethods = ['setTrustedForwarder'];

export const setTrustedForwarderCall = async (
  args: any[],
  tokenAddress: string,
  method: string,
  _forwarder: string,
): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')

  let selectedAbi = DYNAMIC_NFT_ABI; // Use DYNAMIC_NFT_ABI as default ABI
  switch (method) {
    case allMethods[1]:
      selectedAbi = abis[NftMintType.Dynamic];
      break;
    case allMethods[2]:
      selectedAbi = abis[NftMintType.Immutable];
      break;
    case allMethods[0]:
      selectedAbi = abis[NftMintType.Base];
      break;
    default:
      throw new Error(`Invalid method "${method}" for contract address ${tokenAddress}`);

  }

  const contract = new ethers.Contract(tokenAddress, selectedAbi);
  let txStatus = 0;
  let txId = '';

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
        _forwarder: _forwarder,
        contractAddress: tokenAddress
      };

      await createSetTrustedForwarder(updateLoggerPayload);

      txStatus = 1;

      return {
        txId,
        txStatus,
        txRawResult: data,
        txHash,
        decodeData: []
      }
    }
  } catch (error) {
    console.log("err: ", error);
  }

  return {
    txId,
    txStatus
  }
}
