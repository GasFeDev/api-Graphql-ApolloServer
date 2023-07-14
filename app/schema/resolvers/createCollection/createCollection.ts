import { CreateCollectionPayload, CreateTxResponse } from "../../generated";
import { createCollection as createCollectionServices } from "../../../dataServices";

export const createCollection = async ({
  input,
}: {
  input: CreateCollectionPayload;
}): Promise<CreateTxResponse> => {
  try {
    const transactionResult = await createCollectionServices(input)
    return {
      errors: [],
      address: '',
      collectionOwner: input.collectionOwner,
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
