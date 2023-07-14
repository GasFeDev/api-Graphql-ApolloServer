import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddBurnNftTxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostBurnNftTxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionBurn = async (addBurnNftTxPayload: PostBurnNftTxPayload
): Promise<AddBurnNftTxPayload | null> => {
  try {
    const operationDoc = buildDoc(addBurnNftTxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addBurnNftTxPayload && data.addBurnNftTxPayload.numUids;
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

export const buildDoc = (addBurnNftTxPayload: PostBurnNftTxPayload) => {
  console.log("payload", addBurnNftTxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addBurnNftTxPayload(
      input: {
        tokenId: ${addBurnNftTxPayload.tokenId},
        contractAddress: "${addBurnNftTxPayload.contractAddress}",        
        type: ${addBurnNftTxPayload.type},        
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

