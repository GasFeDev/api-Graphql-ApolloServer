import { mintERC20 as mintERC20Service } from "../../../dataServices";
import { AddMintErc20TxPayload, TxResponse } from "../../generated";

export const mintERC20 = async ({
  input,
}: {
  input: AddMintErc20TxPayload;
}): Promise<TxResponse> => {

  try {
    const transactionResult = await mintERC20Service(input);

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
