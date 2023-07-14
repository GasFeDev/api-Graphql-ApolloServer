import { burnNft as burnNftService } from '../../../dataServices'
import { AddBurnNftTxPayload, TxResponse } from '../../generated'

export const burnNft = async (burnNftPayload: {
  input: AddBurnNftTxPayload
}): Promise<TxResponse> => {
  const input = burnNftPayload.input
  try {
    const { contractAddress,  tokenId, type,  } = input

    const transactionResult = await burnNftService({
      tokenId,
      contractAddress,      
      type,
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
