import { setUniqueSvgCall } from '../../../dataServices'
import { AddSetUniqueSvgPayload, TxResponse } from '../../generated'
import { isValidAddress } from 'ethereumjs-util';

export const setUniqueSVG = async ({
  input,
}: {
  input: AddSetUniqueSvgPayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, tokenId, _uniqueSVG } = input;
    // Validar la dirección Ethereum 'contractAddress'
    const errors: any = {};
    if (!isValidAddress(contractAddress)) {
      errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
    }
    if (Object.keys(errors).length > 0) {
      throw new Error(JSON.stringify(errors));
    }
    const transactionResult = await setUniqueSvgCall(
      [tokenId, _uniqueSVG],
      'setUniqueSVG',
      contractAddress,
      _uniqueSVG,
      tokenId
    );
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
