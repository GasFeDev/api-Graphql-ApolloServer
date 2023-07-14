import {
  TxResponse,
  NftMintType,
} from '../../schema/generated'
import { DYNAMIC_NFT_ABI,
  BASE_NFT_ABI,
  INMUTABLE_NFT_ABI } from '../../constants/abis';
import { ethers } from 'ethers';
import { getGSNProvider } from '../../providerAPI';
import { findTxHash } from "../../util";
import { PostMethodCallPayload} from '../txLogger/interfaces';
import { createSetDynamicSvg, createSetUniqueSvg } from '../txLogger/method';

const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

const dynamicMethods = ['setDynamicSvg', 'setUniqueSVG', 'setTokenURI', 'setApprovalForAll', 'setContractURI', 'setTrustedForwarder'];
const immutableMethods = ['setApprovalForAll', 'setContractURI', 'setTrustedForwarder'];
const baseMethods = ['setTokenURI', 'setApprovalForAll', 'setContractURI', 'setTrustedForwarder'];


export const methodCall = async (
  args: any[],
  method: string,
  tokenAddress: string,
  _newSvg?: string,
  _uniqueSVG?:string,
  tokenId?:number
  ): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')
  
  let selectedAbi = DYNAMIC_NFT_ABI; // Use DYNAMIC_NFT_ABI as default ABI
  if (dynamicMethods.includes(method)) {
    selectedAbi = abis[NftMintType.Dynamic];
  } else if (immutableMethods.includes(method)) {
    selectedAbi = abis[NftMintType.Immutable];
  } else if (baseMethods.includes(method)) {
    selectedAbi = abis[NftMintType.Base];
  } else {
    throw new Error(`Invalid method ${method}`);
  }

  const loggerPayload: PostMethodCallPayload = {
    contractAddress: tokenAddress,
    /* contractUri: method === 'setContractURI' ? args[0] : "", */
    decodeData: [],
    message: "",
    /* propertiesName: method === 'setPropertyNames' ? args[1] : [], */
    /* propertiesValues: method === 'setPropertyValue' ? args[1] : [], */
    /* tokenId: method === 'setPropertyValue' ? args[0] : 0, */
    /* trustedForWarder: method === 'setTrustedForwarder' ? args[0] : "", */
    _newSvg: method === 'setDynamicSvg' ? args[0] : "",
    _uniqueSVG: method === 'setUniqueSVG' ? args[1] : [],
    /* approvalForAll: method === 'setApprovalForAll' ? args[1] : [], */
    /* tokenURI: method === 'setTokenURI' ? args[2] : [], */
  };

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
        _newSvg: _newSvg,
        tokenId: tokenId,
        _uniqueSVG: _uniqueSVG,
        contractAddress: tokenAddress};

        await (method === 'setDynamicSvg' ? createSetDynamicSvg(updateLoggerPayload) : createSetUniqueSvg(updateLoggerPayload));


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
