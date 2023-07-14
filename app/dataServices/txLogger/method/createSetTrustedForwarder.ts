import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddSetTrustedForwarderPayload } from "../../../schema/generated";
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

export const createSetTrustedForwarder = async (addSetTrustedForwarderPayload: PostMethodCallPayload
): Promise<AddSetTrustedForwarderPayload | null> => {
  try {
    const operationDoc = buildDoc(addSetTrustedForwarderPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addSetTrustedForwarderPayload && data.addSetTrustedForwarderPayload.numUids;
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

export const buildDoc = (addSetTrustedForwarderPayload: PostMethodCallPayload) => {
  console.log("payload", addSetTrustedForwarderPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addSetTrustedForwarderPayload(
      input: {
        _forwarder: "${addSetTrustedForwarderPayload._forwarder}", 
        contractAddress: "${addSetTrustedForwarderPayload.contractAddress}",  
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

