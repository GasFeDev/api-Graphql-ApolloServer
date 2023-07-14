import { methodCall } from '../../../dataServices'
import { GenericMethodPayload, TxResponse } from '../../generated'

export const setBaseUri = async ({
  input,
}: {
  input: GenericMethodPayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, stringArgument } = input;

    const transactionResult = await methodCall(
      [stringArgument],
      contractAddress,
      'setBaseURI',
      'TX_SET_BASE_URI'
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
