import { CreateTxResponse, AddCreateErc20TxPayload } from "../../generated";
import { createERC20 as createERC20Services } from "../../../dataServices";

export const createERC20 = async ({
  input,
}: {
  input: AddCreateErc20TxPayload;
}): Promise<CreateTxResponse> => {

  try {
    const transactionResult = await createERC20Services(input);

    return {
      errors: [],
      address: '',
      collectionOwner: input.owner_,
      txResponse: transactionResult
    }
  } catch (error: any) {
    console.log('error', error)
    return {
      errors: [error.message],
      address: '',
      collectionOwner: '',
      txResponse: {
        txStatus: 0,
        txId: '',
      },
    }
  }

};
