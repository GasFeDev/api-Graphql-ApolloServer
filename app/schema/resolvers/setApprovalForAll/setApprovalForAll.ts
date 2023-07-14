import { methodCall } from '../../../dataServices'
import { SetApprovalForAllPayload, TxResponse } from '../../generated'

export const setApprovalForAll = async ({
  input,
}: {
  input: SetApprovalForAllPayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, approved, operator } = input;

    const transactionResult = await methodCall(
      [approved, operator],
      contractAddress,
      'setApprovalForAll',
      'TX_SET_APPROVAL_FOR_ALL'
    )
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
