import { methodCall } from '../../../dataServices'
import { GenericMethodPayload, TxResponse } from '../../generated'

export const setDescription = async (mintNFTPayload: {
  input: GenericMethodPayload
}): Promise<TxResponse> => {
  const payload = mintNFTPayload.input
  console.log('payload!', payload)
  try {
    const { contractAddress, stringArgument } = payload

    const result = await methodCall(
      [stringArgument],
      contractAddress,
      'setDescription',
      'TX_SET_DESCRIPTION'
    )
    return {
      txStatus: result.txStatus,
      txId: result.txId,
    }
  } catch (error: any) {
    console.log('error', error)
    return {
      txStatus: 0,
      txId: '',
      message: error.message,
    }
  }
}
