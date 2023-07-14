// import { receiveTransaction } from './receiveTransaction';
import { receiveTransactionReceipt as receiveTX } from '../../../dataServices'
import { ReceiveTransactionTxPayload, TxResponse } from '../../generated'

export const receiveTransaction = async (receiveTransactionPayload: {
  input: ReceiveTransactionTxPayload
}): Promise<TxResponse> => {
  const input = receiveTransactionPayload.input
  try {
    const { txReceipt, nftType, functionName, functionParams, from, to, txid } =
      input

    const transactionResult = await receiveTX({
      txReceipt,
      nftType,
      functionName,
      functionParams,
      from,
      to,
      txid,
    })

    return { ...transactionResult }
  } catch (error: any) {
    console.log('error', error)
    return {
      txStatus: 0,
      txId: '',
      message: error.message,
    }
  }
}
