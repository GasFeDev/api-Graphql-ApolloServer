import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddTransferErc20Payload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostTransferErc20TxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransferERC20 = async (addTransferERC20Payload: PostTransferErc20TxPayload
): Promise<AddTransferErc20Payload | null> => {
  try {
    const operationDoc = buildDoc(addTransferERC20Payload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addTransferERC20Payload && data.addTransferERC20Payload.numUids;
    return loggerTX ? loggerTX[0] : null;
  } catch (error) {
    console.log("ERROR DGRAPH:", error);
    const reportError = getErrorMessage(error);
    transaction("DGRAPH", reportError);
  } finally {
    console.log("END DGRAPH");
  }
  return null;
};

export const fetchGraphQL = async (
  operationDoc: DocumentNode,
  variables: object
) => {
  const body = {
    query: print(operationDoc),
    variables: variables,
  };
  console.log("GraphQL request body:", body);
  try {
    const response = await axios.post(graphqlEndpoint, body, config);
    const { data } = response;
    console.log("GraphQL response:", data);
    return data;
  } catch (error) {
    console.log("ERROR DGRAPH:", error);
    const reportError = getErrorMessage(error);
    transaction("DGRAPH", reportError);
    return null;
  }
};

export const buildDoc = (addTransferERC20Payload: PostTransferErc20TxPayload) => {
  console.log("payload", addTransferERC20Payload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addTransferERC20Payload(
      input: {
        tokenAddress: "${addTransferERC20Payload.tokenAddress}",   
        to: "${addTransferERC20Payload.to}",  
        amount: ${addTransferERC20Payload.amount},          
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

