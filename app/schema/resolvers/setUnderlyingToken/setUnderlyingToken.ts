import { setUnderlyingToken as _setUnderlyingToken } from '../../../dataServices'
import { TxResponse, SetUnderlyingTokenPayload } from '../../generated'

export const setUnderlyingToken = async ({
  input,
}: {
  input: SetUnderlyingTokenPayload;
}): Promise<TxResponse> => {

  console.log('input!', input)
  try {
    const { contractAddress, underlyingToken, isERC20 } = input;

    const transactionResult = await _setUnderlyingToken({
      contractAddress,
      underlyingToken,
      isERC20,
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
