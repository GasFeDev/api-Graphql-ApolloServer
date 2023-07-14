import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddUnequipTokenTxPayload } from "../../schema/generated";
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

export const createTransactionUnequipToken = async (addUnequipTokenTXPayload: PostEquipTokenTXPayload
): Promise<AddUnequipTokenTxPayload | null> => {
  try {
    const operationDoc = buildDoc(addUnequipTokenTXPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addUnequipTokenTXPayload && data.addUnequipTokenTXPayload.numUids;
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

export const buildDoc = (addUnequipTokenTXPayload: PostEquipTokenTXPayload) => {
  console.log("payload", addUnequipTokenTXPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addUnequipTokenTXPayload(
      input: {
        contractAddress: "${addUnequipTokenTXPayload.contractAddress}",  
        _tokenAddress: "${addUnequipTokenTXPayload._tokenAddress}",
        _destinationNFT: ${addUnequipTokenTXPayload._destinationNFT},     
        _tokenId: ${addUnequipTokenTXPayload._tokenId},               
        _amount: ${addUnequipTokenTXPayload._amount},
        type: ${addUnequipTokenTXPayload.type}
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

