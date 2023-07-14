import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddTransferNftPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PosttransferNftTxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionTransferNFT = async (addTransferNftPayload: PosttransferNftTxPayload
): Promise<AddTransferNftPayload | null> => {
  try {
    const operationDoc = buildDoc(addTransferNftPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addTransferNftPayload && data.addTransferNftPayload.numUids;
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

export const buildDoc = (addTransferNftPayload: PosttransferNftTxPayload) => {
  console.log("payload", addTransferNftPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addTransferNftPayload(
      input: {
        contractAddress: "${addTransferNftPayload.contractAddress}",  
        tokenId: ${addTransferNftPayload.tokenId},
        to: "${addTransferNftPayload.to}",     
        type: ${addTransferNftPayload.type},               
        from: "${addTransferNftPayload.from}"
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

