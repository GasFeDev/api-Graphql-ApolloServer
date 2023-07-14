import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddEquipTokenTxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostEquipTokenTXPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionEquipToken = async (addEquipTokenTXPayload: PostEquipTokenTXPayload
): Promise<AddEquipTokenTxPayload | null> => {
  try {
    const operationDoc = buildDoc(addEquipTokenTXPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addEquipTokenTXPayload && data.addEquipTokenTXPayload.numUids;
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

export const buildDoc = (addEquipTokenTXPayload: PostEquipTokenTXPayload) => {
  console.log("payload", addEquipTokenTXPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addEquipTokenTXPayload(
      input: {
        contractAddress: "${addEquipTokenTXPayload.contractAddress}",  
        _tokenAddress: "${addEquipTokenTXPayload._tokenAddress}",
        _destinationNFT: ${addEquipTokenTXPayload._destinationNFT},     
        _tokenId: ${addEquipTokenTXPayload._tokenId},               
        _amount: ${addEquipTokenTXPayload._amount},
        type: ${addEquipTokenTXPayload.type}
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

