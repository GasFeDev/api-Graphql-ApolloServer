import { AddBurnErc20TxPayload, TxResponse } from '../../schema/generated'
import { getGSNProvider } from '../../providerAPI'
import { ERC20_ABI } from '../../constants/abis'
import { ethers } from 'ethers'
import { findTxHash } from '../../util'
import { isValidAddress } from 'ethereumjs-util';
import { createBurnERC20 } from '../txLogger';
import { PostBurnErc20TxPayload } from '../txLogger/interfaces';

export const burnERC20 = async ({
  contractAddress,
  amount,
}: AddBurnErc20TxPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')

  //send TX to Dgraph
  /*const dGraphTx = await sendNewTransaction(
    TX_BURN_ERC721,
    TX_ZERO,
    '',
    '',
    '',
    TX_DESCRIPTION,
    0
  )*/

    // Validar la dirección Ethereum 'contractAddress'
    const errors: any = {};
    if (!isValidAddress(contractAddress)) {
      errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
    }
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

  let txStatus = 0;
   //const txId = dGraphTx?.id || '';
   const txId =  '';
  const contract = new ethers.Contract(contractAddress, ERC20_ABI);

  try {
    const result = await contract
      .connect(gsnSigner)
      .burn(amount)

    console.log('result==>', result);

    if (result) {
      txStatus = 1;
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);
      //Udpdate the graph      
      const updateLoggerPayload: PostBurnErc20TxPayload = {        
        contractAddress: contractAddress,    
        amount: amount,               
      };
      await createBurnERC20(updateLoggerPayload);

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
