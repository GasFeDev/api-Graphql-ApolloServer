import { equipToken as equipTokenService } from '../../../dataServices'
import { AddEquipTokenTxPayload, TxResponse } from '../../generated'

export const equipToken = async (equipTokenPayload: {
  input: AddEquipTokenTxPayload
}): Promise<TxResponse> => {
  const input = equipTokenPayload.input
  try {
    const {contractAddress, _tokenAddress, _destinationNFT, _tokenId, _amount, type} = input

    const transactionResult = await equipTokenService({
      contractAddress,
      _tokenAddress,
      _destinationNFT,
      _tokenId,      
      _amount,
      type,
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
