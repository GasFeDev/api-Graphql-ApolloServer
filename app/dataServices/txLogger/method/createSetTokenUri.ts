import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddSetTokenUriPayload } from "../../../schema/generated";
import { transaction } from "../../sentryLogger";
import { getErrorMessage } from "../../../util";
import { PostMethodCallPayload } from "../interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createSetTokenUri = async (addSetTokenUriPayload: PostMethodCallPayload
): Promise<AddSetTokenUriPayload | null> => {
  try {
    const operationDoc = buildDoc(addSetTokenUriPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addSetTokenUriPayload && data.addSetTokenUriPayload.numUids;
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

export const buildDoc = (addSetTokenUriPayload: PostMethodCallPayload) => {
  console.log("payload", addSetTokenUriPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addSetTokenUriPayload(
      input: {
        _tokenId: ${addSetTokenUriPayload._tokenId},
        _tokenURI: "${addSetTokenUriPayload._tokenURI}", 
        _tokenOwnerSign: ${addSetTokenUriPayload._tokenOwnerSign}, 
        contractAddress: "${addSetTokenUriPayload.contractAddress}",  
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

