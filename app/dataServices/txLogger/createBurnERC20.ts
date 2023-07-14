import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddBurnErc20TxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostBurnErc20TxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createBurnERC20 = async (addBurnErc20TxPayload: PostBurnErc20TxPayload
): Promise<AddBurnErc20TxPayload | null> => {
  try {
    const operationDoc = buildDoc(addBurnErc20TxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addBurnErc20TxPayload && data.addBurnErc20TxPayload.numUids;
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

export const buildDoc = (addBurnErc20TxPayload: PostBurnErc20TxPayload) => {
  console.log("payload", addBurnErc20TxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addBurnErc20TxPayload(
      input: {
        amount: ${addBurnErc20TxPayload.amount},
        contractAddress: "${addBurnErc20TxPayload.contractAddress}",               
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

