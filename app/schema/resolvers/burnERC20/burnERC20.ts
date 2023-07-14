import { burnERC20 as burnERC20Service } from '../../../dataServices'
import { AddBurnErc20TxPayload, TxResponse } from '../../generated'

export const burnERC20 = async (burnERC721Payload: {
  input: AddBurnErc20TxPayload
}): Promise<TxResponse> => {
  const input = burnERC721Payload.input

  try {
    const { contractAddress, amount } = input

    const transactionResult = await burnERC20Service({
      contractAddress,
      amount
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
