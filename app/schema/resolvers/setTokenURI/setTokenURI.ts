import { setTokenURICall } from '../../../dataServices'
import { AddSetTokenUriPayload, TxResponse } from '../../generated'
import { isValidAddress } from 'ethereumjs-util';

export const setTokenURI = async ({
  input,
}: {
  input: AddSetTokenUriPayload;
}): Promise<TxResponse> => {

  try {
    const { contractAddress, _tokenId, _tokenURI, _tokenOwnerSign } = input;
     // Validar la dirección Ethereum 'contractAddress'
     const errors: any = {};
     if (!isValidAddress(contractAddress)) {
       errors.contractAddress = `Please use an Ethereum address, the contract address ${contractAddress} is invalid.`;
     }
     if (Object.keys(errors).length > 0) {
       throw new Error(JSON.stringify(errors));
     }

    const transactionResult = await setTokenURICall(
      [_tokenId, _tokenURI, _tokenOwnerSign],
      contractAddress,
      'setTokenURI',
      _tokenId,
      _tokenURI,
      _tokenOwnerSign
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
