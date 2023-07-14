import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddCreateErc20TxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostCreateErc20TxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionERC20 = async (addCreateErc20TxPayload: PostCreateErc20TxPayload
): Promise<AddCreateErc20TxPayload | null> => {
  try {
    const operationDoc = buildDoc(addCreateErc20TxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addCreateErc20TxPayload && data.addCreateErc20TxPayload.numUids;
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

export const buildDoc = (addCreateErc20TxPayload: PostCreateErc20TxPayload) => {
  console.log("payload", addCreateErc20TxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addCreateErc20TxPayload(
      input: {
        txHash: "${addCreateErc20TxPayload.txHash}",
        txType: "${addCreateErc20TxPayload.txType}",
        factoryERC20Address: "${addCreateErc20TxPayload.factoryERC20Address}",
        message: "${addCreateErc20TxPayload.message}",
        confirm: ${addCreateErc20TxPayload.confirm},
        name_: "${addCreateErc20TxPayload.name_}",
        symbol_: "${addCreateErc20TxPayload.symbol_}",        
        decimals_: ${addCreateErc20TxPayload.decimals_},
        maxSupply_: ${addCreateErc20TxPayload.maxSupply_},
        owner_: "${addCreateErc20TxPayload.owner_}",        
      }
    ) {
      numUids
    }
  }
`;
  return operationDoc;
};

