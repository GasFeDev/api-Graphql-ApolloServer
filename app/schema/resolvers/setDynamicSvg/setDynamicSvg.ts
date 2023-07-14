import { setDynamicSvgCall } from '../../../dataServices'
import { AddSetDynamicSvgPayload, TxResponse } from '../../generated'
import { isValidAddress } from 'ethereumjs-util';


export const setDynamicSvg = async ({
  input,
}: {
  input: AddSetDynamicSvgPayload;
}): Promise<TxResponse> => {

  try {
    const { _newSvg, contractAddress} = input;
     // Validar la dirección Ethereum 'contractAddress'
     const errors: any = {};
     if (!isValidAddress(contractAddress)) {
       errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
     }
     if (Object.keys(errors).length > 0) {
       throw new Error(JSON.stringify(errors));
     }

    const transactionResult = await setDynamicSvgCall(
       [_newSvg],
      contractAddress,
      'setDynamicSvg',
      `'${_newSvg}'`
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
