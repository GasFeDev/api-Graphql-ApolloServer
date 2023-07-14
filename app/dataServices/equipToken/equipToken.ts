import {
  TxResponse,
  NftMintType,
  AddEquipTokenTxPayload,
} from '../../schema/generated'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI';
import {
  DYNAMIC_NFT_ABI,
  BASE_NFT_ABI,
  INMUTABLE_NFT_ABI
} from '../../constants/abis';
import { findTxHash } from "../../util";
import { createTransactionEquipToken } from '../txLogger';
import { PostEquipTokenTXPayload} from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';


const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

export const equipToken = async ({
  contractAddress,
  _tokenAddress,
  _destinationNFT,
  _tokenId,
  _amount,
  type,
}: AddEquipTokenTxPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('mumbai')
  // Validar la dirección Ethereum 'contractAddress, _tokenAddress'
  const errors: any = {};
  if (!isValidAddress(contractAddress)) {
    errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
  }
  if (!isValidAddress(_tokenAddress)) {
    errors._tokenAddress = `Please use an Ethereum address, the contract address ${_tokenAddress} is invalid.`;
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  const value = _tokenId * 1e4;
  const args = {
    [NftMintType.Dynamic]: [_tokenAddress, _destinationNFT, _tokenId, _amount],
    [NftMintType.Base]: [_tokenAddress, _destinationNFT, _tokenId, _amount],
    [NftMintType.Immutable]: [_tokenAddress, _destinationNFT, _tokenId, _amount]
  }

  let txStatus = 0;
  let txId = '';

  const contract = new ethers.Contract(contractAddress, abis[type])

  try {
    
    //const functionName = await contract.connect(gsnSigner).functions;
    //console.log(args[type]);
    console.log("contractAddress: ", contractAddress);
    console.log("_tokenAddress: ", _tokenAddress);
    console.log("_destinationNFT: ", _destinationNFT);
    console.log("_tokenId: ", _tokenId);
    console.log("_amount: ", _amount);
    const result = await contract.connect(gsnSigner).equipToken(...args[type])
    console.log("result: ", result);
    if (result) {
      const data = await result.wait();
      console.log("data: ", data);
      const txHash = findTxHash(0, data?.logs);

      const updateLoggerPayload: PostEquipTokenTXPayload = {
        id: txId,
        decodeData: [],
        contractAddress: contractAddress,
        confirm: 1,
        message: "TX confirmed",
        _tokenAddress: _tokenAddress,
        _destinationNFT: _destinationNFT,
        _tokenId: _tokenId,
        _amount: _amount,
        type: type
      };

      await createTransactionEquipToken(updateLoggerPayload);

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
    console.log("error: ", e);
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
