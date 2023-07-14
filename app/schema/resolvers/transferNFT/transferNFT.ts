import { transferNft as transferNftService } from '../../../dataServices'
import { AddTransferNftPayload, TxResponse } from '../../generated'

export const transferNft = async (addTransferNftPayload: {
  input: AddTransferNftPayload
}): Promise<TxResponse> => {
  const input = addTransferNftPayload.input
  try {
    const { contractAddress,  tokenId, to, type, from } = input

    const transactionResult = await transferNftService({
      contractAddress,
      tokenId,
      to,
      type,
      from,
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
