import { AddCreateErc20TxPayload, TxResponse } from "../../schema/generated";
import { DEGA_ERC20_FACTORY_ABI } from "../../constants/abis";
import { decoder, findTxHash } from "../../util";
import { getGSNProvider } from '../../providerAPI';
import { createTransactionERC20 } from '../txLogger';
import { CREATE_ERC20, TX_ZERO } from "../../constants/txTypes";
import { CREATE_ERC20_LOG } from "../../constants/txUtil";
import { ethers, BigNumber } from "ethers";
import { getProvider } from "../providerConfig";
import { PostCreateErc20TxPayload } from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';

export const createERC20 = async (
  createErc20Payload: AddCreateErc20TxPayload): Promise<TxResponse> => {

  const { gsnSigner } = await getGSNProvider('dega');
  const providerMetaData = getProvider("dega");
  const { factoryERC20Address } = providerMetaData;
  const { name_, symbol_, decimals_, maxSupply_,  owner_ } =
    createErc20Payload;

  // Validar la dirección Ethereum 'owner_'
  const errors: any = {};
  if (!isValidAddress(owner_)) {
    errors.owner_ = `Please use an Ethereum address, the wallet address ${owner_} is invalid.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  const totalSupply = BigNumber.from(maxSupply_.toString());

  const CreateErc20TxPayload: PostCreateErc20TxPayload = { 
    name_: name_, 
    symbol_: symbol_,  
    decimals_: decimals_,    
    maxSupply_: maxSupply_,    
    owner_: owner_,       
    txHash: TX_ZERO,
    txType: CREATE_ERC20,
    factoryERC20Address: factoryERC20Address,
  };  
  
  let txStatus = 0
  let txId = '';

  const contract = new ethers.Contract(factoryERC20Address, DEGA_ERC20_FACTORY_ABI)

  try {
    const result = await contract.connect(gsnSigner).createERC20(name_, symbol_, decimals_, maxSupply_, owner_);

    if (result) {
      txStatus = 1;
      //find the result 
      const data = await result.wait();
      const decodedData = decoder(data, CREATE_ERC20_LOG);
      const txHash = findTxHash(0, data?.logs);

      const postCreateErc20TxPayload: PostCreateErc20TxPayload = {
        id: txId,
        txHash: txHash,
        txType: CREATE_ERC20,
        factoryERC20Address: factoryERC20Address,
        message: 'TX confirmed',
        confirm: 1,
        name_: name_,
        symbol_: symbol_,        
        decimals_: decimals_,
        maxSupply_: maxSupply_,
        owner_: owner_,    
      };
      //Udpdate the graph
      await createTransactionERC20(postCreateErc20TxPayload);

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
};
