import { transferERC721 as sponsorService } from '../../../dataServices'
import { TransferErc721Payload, TxResponse } from '../../generated'

export const transferERC721 = async (singlePayload: {
  input: TransferErc721Payload
}): Promise<TxResponse> => {
  try {
    const { from, to, contractAddress, tokenId } = singlePayload.input

    const transactionResult = await sponsorService({
      from,
      to,
      contractAddress,
      tokenId,
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
