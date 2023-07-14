import { unequipToken as unequipTokenService } from '../../../dataServices'
import { AddUnequipTokenTxPayload, TxResponse } from '../../generated'

export const unequipToken = async (unequipTokenPayload: {
  input: AddUnequipTokenTxPayload
}): Promise<TxResponse> => {
  const input = unequipTokenPayload.input
  try {
    const {contractAddress, _tokenAddress, _destinationNFT, _tokenId, type, _amount,} = input

    const transactionResult = await unequipTokenService({
      contractAddress,
      _tokenAddress,
      _destinationNFT,
      _tokenId,
      type,
      _amount,
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
