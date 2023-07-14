import { transferERC20 as sponsorService } from "../../../dataServices";
import { AddTransferErc20Payload, TxResponse } from "../../generated";

export const transferERC20 = async ({
  input,
}: {
  input: AddTransferErc20Payload;
}): Promise<TxResponse> => {

  try {
    const transactionResult = await sponsorService(input);

    return { ...transactionResult };

  } catch (error: any) {
    console.log('error', error)
    return {
      txStatus: 0,
      txId: '',
      message: error.message,
    }
  }
};
