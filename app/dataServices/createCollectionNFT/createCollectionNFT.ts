import {
  AddCreateCollectionNftTxPayload,
  TxResponse,
  NftCreateType,
} from '../../schema/generated'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI';
import {
  DEGA_NFT_FACTORY_ABI
} from '../../constants/abis';
import { findTxHash } from "../../util";
import { createTransactionCollection } from '../txLogger';
import { PostCreateCollectionNftTxPayload } from '../txLogger/interfaces';
import { isValidAddress } from 'ethereumjs-util';

const abis = {
  [NftCreateType.Base]: DEGA_NFT_FACTORY_ABI,
  [NftCreateType.Dynamic]: DEGA_NFT_FACTORY_ABI,
  [NftCreateType.Immutable]: DEGA_NFT_FACTORY_ABI,
}

export const createCollectionNFT = async ({
  contractAddress,
  data,
  _dynamicSVG,
  _nftType,
}: AddCreateCollectionNftTxPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('mumbai')
  // Validar la dirección Ethereum 'contractAddress'
  const errors: any = {};
  if (!isValidAddress(contractAddress)) {
    errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
  }
  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  }

  let nftTypeValue = 0;

  if (_nftType === NftCreateType.Dynamic) {
    data.isDynamic = true;
    data.isImmutable = false;
    nftTypeValue = 1;
  } else if (_nftType === NftCreateType.Immutable) {
    data.isDynamic = false;
    data.isImmutable = true;
    nftTypeValue = 2;
  }

  const args = {
    [NftCreateType.Base]: [data, _nftType],
    [NftCreateType.Dynamic]: [data, _dynamicSVG],
    [NftCreateType.Immutable]: [data, _nftType],
  }

  const loggerPayload: PostCreateCollectionNftTxPayload = {
    contractAddress: contractAddress,
    _nftType: _nftType,
    _dynamicSVG: _dynamicSVG,
    data: data,
  };
  //send TX to Dgraph

  let txStatus = 0;
  let txId = '';

  const contract = new ethers.Contract(contractAddress, DEGA_NFT_FACTORY_ABI);

  try {
    console.log("args: ", args[_nftType], _dynamicSVG);
    const result = await contract.connect(gsnSigner).createNFTContract(...args[_nftType], nftTypeValue)
    if (result) {
      const data = await result.wait();
      const txHash = findTxHash(0, data?.logs);

      const dGraphTx = await createTransactionCollection(loggerPayload);
      txId = dGraphTx?.contractAddress || '';

      const updateLoggerPayload: PostCreateCollectionNftTxPayload = {
        id: txId,
        decodeData: [],
        contractAddress: contractAddress,
        confirm: 1,
        message: "TX confirmed",
        _nftType: _nftType,
        _dynamicSVG: _dynamicSVG,
        data: data,
      };

      await createTransactionCollection(updateLoggerPayload);

      txStatus = 1;

      return {
        txId,
        txStatus: txStatus,
        txRawResult: data,
        txHash: txHash,
        decodeData: [],
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