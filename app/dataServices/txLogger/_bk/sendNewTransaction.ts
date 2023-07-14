import axios from "axios";
import * as dotenv from "dotenv";
import { LoggerTx, TxResponse } from "../../../schema/generated";
import { transaction } from "../../sentryLogger";
import { getErrorMessage } from "../../../util";
import { STATUS_200, STATUS_500 } from "../../../constants/status";
import { PostLoggerTXPayload } from "../interfaces";

dotenv.config();

const INDEXER_URL = `${process.env.INDEXER_ENPOINT}/tx/new` || "";
const INDEXER_SKIP = process.env.INDEXER_SKIP || false;
const ERROR_PAYLOAD: LoggerTx = {
  id: "",
  confirm: 0,
  from: "",
  to: "",
  timestamp: "",
  txHash: "",
  txType: ""
};

export const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const sendNewTransaction = async (loggerTXPayload: PostLoggerTXPayload
): Promise<LoggerTx | null> => {

  if (INDEXER_SKIP) {
    return ERROR_PAYLOAD;
  }

  const result = await axios.post(INDEXER_URL, {
    ...loggerTXPayload
  }, config)
    .then(function (response) {
      if (response.status === STATUS_200) {
        return response.data;
      } else if (response.status === STATUS_500) {
        return ERROR_PAYLOAD;
      }
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
      console.log("ERROR INDEXER:", error);
      return ERROR_PAYLOAD;
    }).finally(() => {
      console.log("END INDEXER");
    });


  console.log(result);

  return result;
};