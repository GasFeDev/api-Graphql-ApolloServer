import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddMintErc20TxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostMintErc20TxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionMintERC20 = async (addMintErc20TxPayload: PostMintErc20TxPayload
): Promise<AddMintErc20TxPayload | null> => {
  try {
    const operationDoc = buildDoc(addMintErc20TxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addMintErc20TxPayload && data.addMintErc20TxPayload.numUids;
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

export const buildDoc = (addMintErc20TxPayload: PostMintErc20TxPayload) => {
  console.log("payload", addMintErc20TxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addMintErc20TxPayload(
      input: {        
        txHash: "${addMintErc20TxPayload.txHash}",
        txType: "${addMintErc20TxPayload.txType}",        
        account: "${addMintErc20TxPayload.account}",
        contractAddress: "${addMintErc20TxPayload.contractAddress}",        
        amount: ${addMintErc20TxPayload.amount},        
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

