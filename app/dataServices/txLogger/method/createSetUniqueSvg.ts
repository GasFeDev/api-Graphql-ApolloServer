import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddSetUniqueSvgPayload } from "../../../schema/generated";
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

export const createSetUniqueSvg = async (addSetUniqueSvgPayload: PostMethodCallPayload
): Promise<AddSetUniqueSvgPayload | null> => {
  try {
    const operationDoc = buildDoc(addSetUniqueSvgPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addSetUniqueSvgPayload && data.addSetUniqueSvgPayload.numUids;
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

export const buildDoc = (addSetUniqueSvgPayload: PostMethodCallPayload) => {
  console.log("payload", addSetUniqueSvgPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addSetUniqueSvgPayload(
      input: {
        tokenId: ${addSetUniqueSvgPayload.tokenId},
        _uniqueSVG: "${addSetUniqueSvgPayload._uniqueSVG}", 
        contractAddress: "${addSetUniqueSvgPayload.contractAddress}",  
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

