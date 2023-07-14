import { setTrustedForwarderCall } from '../../../dataServices'
import { AddSetTrustedForwarderPayload, TxResponse } from '../../generated'
import { isValidAddress } from 'ethereumjs-util';

export const setTrustedForwarder = async ({
  input,
}: {
  input: AddSetTrustedForwarderPayload;
}): Promise<TxResponse> => {

  try {
    const { _forwarder, contractAddress } = input;

         const errors: any = {};
         if (!isValidAddress(contractAddress)) {
           errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
         }
         if (Object.keys(errors).length > 0) {
           throw new Error(JSON.stringify(errors));
         }

    const transactionResult = await setTrustedForwarderCall(
      [_forwarder],
      contractAddress,
      'setTrustedForwarder',
      _forwarder
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
