import { methodCall } from '../../../dataServices'
import { SetPropertyNamesPayload, TxResponse } from '../../generated'

export const setPropertyNames = async ({
  input,
}: {
  input: SetPropertyNamesPayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, count, names } = input;

    const transactionResult = await methodCall(
      [count,names],
      contractAddress,
      'setPropertyNames',
      'TX_SET_PROPERTY_NAMES'
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
