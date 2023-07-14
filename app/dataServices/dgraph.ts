import * as dgraph from "dgraph-js-http";

const apiKey = process.env.DGRAPH_KEY || "";
const graphqlEndopint = process.env.DGRAPH_ENDPOINT || "";

const clientStub = new dgraph.DgraphClientStub(graphqlEndopint);
const dgraphClient = new dgraph.DgraphClient(clientStub);

dgraphClient.setCloudApiKey(apiKey);

export { dgraphClient, dgraph };
