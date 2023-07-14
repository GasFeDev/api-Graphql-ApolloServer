import { setContractURICall } from '../../../dataServices'
import { AddsetContractUriPayload, TxResponse } from '../../generated'
import { isValidAddress } from 'ethereumjs-util';

export const setContractURI = async ({
  input,
}: {
  input: AddsetContractUriPayload;
}): Promise<TxResponse> => {

  try {
    const { _uri, contractAddress } = input;
    // Validar la dirección Ethereum 'contractAddress'
    const errors: any = {};
    if (!isValidAddress(contractAddress)) {
      errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
    }
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }

    const transactionResult = await setContractURICall(
      [_uri],
      contractAddress,
      'setContractURI',
      _uri
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
