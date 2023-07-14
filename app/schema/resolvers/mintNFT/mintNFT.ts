import { mintNFT as mintNFTService } from '../../../dataServices'
import { AddMintNftTxPayload, TxResponse } from '../../generated'

export const mintNFT = async (mintNFTPayload: {
  input: AddMintNftTxPayload
}): Promise<TxResponse> => {
  const input = mintNFTPayload.input
  try {
    const { tokenAddress,  tokenId, to, type, _properties, _tokenURI, numUids } = input

    const transactionResult = await mintNFTService({
      tokenAddress,
      tokenId,
      to,
      type,
      _properties,
      _tokenURI, 
      numUids
    })

    return { ...transactionResult };

  } catch (error: any) {
    console.log('error', error)
    return {
      txStatus: 0,
      txId: '',
      message: error.message,
    }
  }
}
