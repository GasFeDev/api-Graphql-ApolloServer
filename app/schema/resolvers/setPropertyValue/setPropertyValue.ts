import { methodCall } from '../../../dataServices'
import { SetPropertyValuePayload, TxResponse } from '../../generated'

export const setPropertyValue = async ({
  input,
}: {
  input: SetPropertyValuePayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, tokenId, values } = input;

    const transactionResult = await methodCall(
      [tokenId,values],
      contractAddress,
      'setPropertyValue',
      'TX_SET_PROPERTY_VALUE'
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
