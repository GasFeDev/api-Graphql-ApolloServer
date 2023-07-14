import {
  TxResponse,
  NftMintType,
  AddUnequipTokenTxPayload,
} from '../../schema/generated'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI';
import {
  DYNAMIC_NFT_ABI,
  BASE_NFT_ABI,
  INMUTABLE_NFT_ABI
} from '../../constants/abis';
import { findTxHash } from "../../util";
import { createTransactionUnequipToken } from '../txLogger';
import { PostEquipTokenTXPayload} from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';


const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

export const unequipToken = async ({
  contractAddress,
  _tokenAddress,
  _destinationNFT,
  _tokenId,
  _amount,
  type,
}: AddUnequipTokenTxPayload): Promise<TxResponse> => {
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
    console.log(args[type]);
    const result = await contract.connect(gsnSigner).unequipToken(...args[type])
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

      await createTransactionUnequipToken(updateLoggerPayload);

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