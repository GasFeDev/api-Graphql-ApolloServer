import {
  AddMintNftTxPayload,
  TxResponse,
  NftMintType,
} from '../../schema/generated'
import { ethers } from 'ethers'
import { getGSNProvider } from '../../providerAPI'
import {
  DYNAMIC_NFT_ABI,
  BASE_NFT_ABI,
  INMUTABLE_NFT_ABI,
} from '../../constants/abis'
import { findTxHash } from '../../util'
import { createTransaction } from '../txLogger'
import { PostMintNftTxPayload } from '../txLogger/interfaces'
import { isValidAddress } from 'ethereumjs-util'

const abis = {
  [NftMintType.Dynamic]: DYNAMIC_NFT_ABI,
  [NftMintType.Base]: BASE_NFT_ABI,
  [NftMintType.Immutable]: INMUTABLE_NFT_ABI,
}

export const mintNFT = async ({
  to,
  tokenAddress,
  type,
  _properties,
  _tokenURI,
}: AddMintNftTxPayload): Promise<TxResponse> => {
  const { gsnSigner } = await getGSNProvider('dega')
  // Validar la dirección Ethereum 'to, tokenAddress'
  const errors: any = {}
  if (!isValidAddress(to)) {
    errors.to = `Utilice una dirección Ethereum, la dirección ${to} es inválida.`
  }
  if (!isValidAddress(tokenAddress)) {
    errors.tokenAddress = `Utilice una dirección Ethereum, la dirección ${tokenAddress} es inválida.`
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors))
  }

  const args = {
    [NftMintType.Dynamic]: [to, _properties],
    [NftMintType.Base]: [to],
    [NftMintType.Immutable]: [to, _properties, _tokenURI],
  }

  const mintPayload: PostMintNftTxPayload = {
    to: to,
    tokenAddress: tokenAddress,
    type: type,
    _properties: _properties,
    _tokenURI: _tokenURI,
  }

  let txId = ''
  let txStatus = 0
  const contract = new ethers.Contract(tokenAddress, abis[type])

  try {
    //const functionName = await contract.connect(gsnSigner).functions;
    console.log(args[type])
    const result = await contract.connect(gsnSigner).createToken(...args[type])

    console.log('Transaction sent:', result.hash)
    if (result) {
      txStatus = 1
      const data = await result.wait()
      const txHash = findTxHash(0, data?.logs)
      //Udpdate the graph
      const postMintNftTxPayload: PostMintNftTxPayload = {
        id: txId,
        decodeData: [],
        confirm: 1,
        message: 'TX confirmed',
        to: to,
        tokenAddress: tokenAddress,
        type: type,
        _properties: _properties,
        _tokenURI: _tokenURI,
        //numUids: numUids ?? 1,
      }

      await createTransaction(postMintNftTxPayload)

      return {
        txId,
        txStatus: txStatus,
        txRawResult: data,
        txHash: txHash,
        decodeData: [],
      }
    }
  } catch (e) {
    console.log('err: ', e)
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
