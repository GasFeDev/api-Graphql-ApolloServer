import { burnERC721 as burnERC721Service } from '../../../dataServices'
import { BurnErc721, TxResponse } from '../../generated'

export const burnERC721 = async (burnERC721Payload: {
  input: BurnErc721
}): Promise<TxResponse> => {
  const input = burnERC721Payload.input

  try {
    const { contractAddress, tokenId } = input

    const transactionResult = await burnERC721Service({
      contractAddress,
      tokenId,
    });

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
