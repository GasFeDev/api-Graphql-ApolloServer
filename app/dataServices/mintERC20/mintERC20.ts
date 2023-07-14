import { findTxHash } from "../../util";
import {
  TX_MINT_ERC20,
} from "../../constants/txTypes";
import { ethers,} from "ethers";
import { getGSNProvider } from '../../providerAPI';
import { TxResponse, AddMintErc20TxPayload } from "../../schema/generated";
import { ERC20_ABI } from "../../constants/abis";
import { PostMintErc20TxPayload } from '../txLogger/interfaces';
import { createTransactionMintERC20 } from '../txLogger';
import { isValidAddress } from 'ethereumjs-util';


export const mintERC20 = async (mintERC20Payload: AddMintErc20TxPayload): Promise<TxResponse> => {

  const { gsnSigner } = await getGSNProvider('dega');
  const { contractAddress, account, amount} =
    mintERC20Payload;
  
  /*const dGraphTx = await sendNewTransaction(
    TX_MINT_ERC20,
    TX_ZERO,
    '',
    '',
    factoryERC20Address,
    TX_DESCRIPTION,
    0
  ); */
  
  const errors: any = {};
  if (!isValidAddress(contractAddress)) {
    errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
  }
  if (!isValidAddress(account)) {
    errors.account = `Please use an Ethereum address, the wallet address ${account} is invalid.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }
  
  let txStatus = 0;
  //const txId = dGraphTx?.id || '';
  const txId =  '';
  const contract = new ethers.Contract(contractAddress, ERC20_ABI)

  try {
    const result = await contract.connect(gsnSigner).mint(account, amount);

    if (result) {
      txStatus = 1;
      //find the result 
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);
      const postMintErc20TxPayload: PostMintErc20TxPayload = {        
        txHash: txHash,
        txType: TX_MINT_ERC20,        
        contractAddress:contractAddress,
        account:account,
        amount: amount, 
      };
      //Udpdate the graph
      await createTransactionMintERC20(postMintErc20TxPayload);

      return {
        txId,
        txStatus: txStatus,
        txHash: txHash,
        txRawResult: data,
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
};
