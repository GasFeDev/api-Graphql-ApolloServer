import { singleTX as singleTXService } from "../../../dataServices";
import { SingleTxPayload, TxResponse } from "../../generated";

export const singleTX = async (singlePayload: any): Promise<TxResponse> => {
  const payload: SingleTxPayload = singlePayload.payload;
  console.log("payload!", payload);
  const { walletPrivateKey, contractAddress, from, to } = payload;
  console.log("here single!!!", walletPrivateKey, contractAddress, payload);

  await singleTXService({ walletPrivateKey, contractAddress, from, to });
  return {
    txId: "",
    txStatus: 0,
  };
};
