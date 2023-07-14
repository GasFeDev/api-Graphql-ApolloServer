import { ethers } from 'ethers'
import { TX_DESCRIPTION_SDK } from '../../constants/txTypes'
import { ReceiveTransactionTxPayload, TxResponse } from '../../schema/generated'
import { createRawTransaction } from '../txLogger'
import { PostLoggerTXPayload } from '../txLogger/interfaces'

export const receiveTransactionReceipt = async ({
  txReceipt,
  nftType,
  functionName,
  functionParams,
  from,
  to,
  txid,
}: ReceiveTransactionTxPayload): Promise<TxResponse> => {
  const txData: any = JSON.parse(txReceipt.replace(/\'/g, '"'))
  try {
    const loggerPayload: PostLoggerTXPayload = {
      confirm: txData.confirmations,
      description: TX_DESCRIPTION_SDK,
      from,
      nftType: nftType,
      to,
      txId: txid,
      txHash: txReceipt,
      txType: functionName,
      functionName,
      functionParams,
    }

    //send TX to Dgraph
    const dGraphTx = await createRawTransaction(loggerPayload)

    console.log(`DGRAPH ${JSON.stringify(dGraphTx)}`)
    let txStatus = 0
    const resultId = dGraphTx || ''

    return {
      txId: resultId,
      txStatus: txStatus,
      txRawResult: txReceipt,
      txHash: txReceipt,
      decodeData: [],
      message: 'Transaction Data saved',
    }
  } catch (e) {
    console.log('err: ', e)
  }

  return {
    txId: txData.transactionHash,
    txStatus: 9999,
  }
}
