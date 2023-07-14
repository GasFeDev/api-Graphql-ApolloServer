import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddMintNftTxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostMintNftTxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransaction = async (addMintNftTxPayload: PostMintNftTxPayload
): Promise<AddMintNftTxPayload | null> => {
  try {
    const operationDoc = buildDoc(addMintNftTxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addMintNftTxPayload && data.addMintNftTxPayload.numUids;
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

export const buildDoc = (addMintNftTxPayload: PostMintNftTxPayload) => {
  console.log("payload", addMintNftTxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addMintNftTxPayload(
      input: {
        to: "${addMintNftTxPayload.to}",
        tokenAddress: "${addMintNftTxPayload.tokenAddress}",        
        type: ${addMintNftTxPayload.type},
        _properties: ${addMintNftTxPayload._properties ? `[${addMintNftTxPayload._properties.map((p) => `{ name: "${p.name}", value: "${p.value}" }`).join(',')}]` : '[]'}          
        _tokenURI: "${addMintNftTxPayload._tokenURI || null}"
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

