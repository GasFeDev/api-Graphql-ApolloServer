import { TxResponse } from '../../schema/generated';
import { DYNAMIC_NFT_ABI } from './../../constants/abis';
import { ethers } from 'ethers';
import { getGSNProvider } from '../../providerAPI';
import { createSetDynamicSvg } from '../txLogger/method';
import { findTxHash } from "../../util";
import { PostMethodCallPayload } from '../txLogger/interfaces';

const dynamicMethods = ['setDynamicSvg'];

export const setDynamicSvgCall = async (
  args: any[],
  tokenAddress: string,
  method: string,
  _newSvg: string,
): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega');

  if (!dynamicMethods.includes(method)) {
    throw new Error(`Invalid method ${method}`);
  }

  let txStatus = 0;
  let txId = '';

  const contract = new ethers.Contract(tokenAddress, DYNAMIC_NFT_ABI);

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
        contractAddress: tokenAddress
      };

      await createSetDynamicSvg(updateLoggerPayload);

      txStatus = 1;

      return {
        txId,
        txStatus: txStatus,
        txRawResult: data,
        txHash: txHash,
        decodeData: []
      };
    }

  } catch (e) {
    console.log("err: ", e);
    return {
      txId,
      txStatus: 0
    };
  }

  return {
    txId,
    txStatus: txStatus
  };
};
