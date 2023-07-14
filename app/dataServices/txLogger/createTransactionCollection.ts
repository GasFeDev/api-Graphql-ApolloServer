import axios from "axios";
import { DocumentNode, print } from "graphql";
import { gql } from "apollo-server-express";
import { AddCreateCollectionNftTxPayload } from "../../schema/generated";
import { transaction } from "../sentryLogger";
import { getErrorMessage } from "../../util";
import { PostCreateCollectionNftTxPayload } from "./interfaces";
import * as dotenv from "dotenv";

dotenv.config();

const graphqlEndpoint = process.env.DGRAPH_ENDPOINT || "";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Auth-Token": process.env.DGRAPH_KEY,
  },
};

export const createTransactionCollection = async (addCreateCollectionNftTxPayload: PostCreateCollectionNftTxPayload
): Promise<AddCreateCollectionNftTxPayload | null> => {
  try {
    const operationDoc = buildDoc(addCreateCollectionNftTxPayload);
    const response = await fetchGraphQL(operationDoc, {})
    const { data } = response;
    const loggerTX = data && data.addCreateCollectionNftTxPayload && data.addCreateCollectionNftTxPayload.numUids;
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
    /* console.log("GraphQL response:", data); */
    return data;
  } catch (error) {
    console.log("ERROR DGRAPH:", error);
    const reportError = getErrorMessage(error);
    transaction("DGRAPH", reportError);
    return null;
  }
};

export const buildDoc = (addCreateCollectionNftTxPayload: PostCreateCollectionNftTxPayload) => {
  console.log("payload", addCreateCollectionNftTxPayload);
  const newDate = new Date().toISOString();
  const operationDoc = gql`
  mutation MyMutation {
    addCreateCollectionNftTxPayload(
      input: {
        contractAddress: "${addCreateCollectionNftTxPayload.contractAddress}",
        data: {
          baseURI: "${addCreateCollectionNftTxPayload.data.baseURI}",
          contractURI: "${addCreateCollectionNftTxPayload.data.contractURI}",
          evolutionaryProperties: [${addCreateCollectionNftTxPayload.data.evolutionaryProperties?.map((p) => `{ name: "${p.name}", value: "${p.value}" }`).join(',')}],
          forwarder: "${addCreateCollectionNftTxPayload.data.forwarder}",
          owner: "${addCreateCollectionNftTxPayload.data.owner}",
          isComposable: ${addCreateCollectionNftTxPayload.data.isComposable},
          isDynamic: ${addCreateCollectionNftTxPayload.data.isDynamic},
          isEvolutionary: ${addCreateCollectionNftTxPayload.data.isEvolutionary},
          isImmutable: ${addCreateCollectionNftTxPayload.data.isImmutable},
          isMetadataOnChain: ${addCreateCollectionNftTxPayload.data.isMetadataOnChain},
          isMultisign: ${addCreateCollectionNftTxPayload.data.isMultisign},
          maxSupply: ${addCreateCollectionNftTxPayload.data.maxSupply},
          name: "${addCreateCollectionNftTxPayload.data.name}",
          symbol: "${addCreateCollectionNftTxPayload.data.symbol}",
        },
        _nftType: ${addCreateCollectionNftTxPayload._nftType},
        ${addCreateCollectionNftTxPayload._dynamicSVG ? `_dynamicSVG: "${addCreateCollectionNftTxPayload._dynamicSVG.replace(/\"/g, "'")}"` : ""}
      }
    ) {
      numUids
    }
  }
`;
return operationDoc;
};


