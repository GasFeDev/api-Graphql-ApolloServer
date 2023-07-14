import { createCollectionNFT as createCollectionNFTService } from '../../../dataServices'
import { AddCreateCollectionNftTxPayload, TxResponse } from '../../generated'

export const createCollectionNFT = async (addCreateCollectionNftTxPayload: {
  input: AddCreateCollectionNftTxPayload
}): Promise<TxResponse> => {
  const input = addCreateCollectionNftTxPayload.input
  try {
    const {contractAddress, data, _nftType, _dynamicSVG} = input

    const transactionResult = await createCollectionNFTService({
      contractAddress,
      data,
      _nftType,
      _dynamicSVG,      
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
