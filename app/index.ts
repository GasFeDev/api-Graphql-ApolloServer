// Import tracing for telemetry 
//import { init } from "./tracing";

import { ApolloServer } from "apollo-server-express";
import fs from "fs";
import path from "path";
import { gql } from "apollo-server-express";
import { GraphQLError } from 'graphql';
import { resolvers } from "./schema/resolvers";
import express from "express";
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { verifyToken } from "./verifyToken";
import http from "http";
import https from "https";
import * as dotenv from "dotenv";

dotenv.config();
const ENV = process.env.ENV || "DEV";
//const APP_PORT = ENV === "PROD" ? process.env.APP_SSL_PORT : process.env.APP_PORT;
const APP_PORT = process.env.APP_PORT || 5000;
const API_KEY = process.env.API_KEY || "";

//init();

const getServer = (app: any) => {
  if (ENV === "PROD") {

    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, './');

    const keyPath = fs.readFileSync(`${envPath}private.key`);
    const certPath = fs.readFileSync(`${envPath}certificate.crt`)

    console.log(envPath);
    const httpsServer = https.createServer(
      {
        key: keyPath,
        cert: certPath
      }, app);

    return httpsServer;
  } else {
    const httpServer = http.createServer(app);
    return httpServer;
  }
}

process.on("uncaughtException", function (error) {
  console.log(error.stack);
});



async function startApolloServer(schema: any, resolvers: any) {
  const app = express();

  const degaServer = getServer(app);

  const plugins = ENV === "PROD"
    ? [ApolloServerPluginDrainHttpServer({ httpServer: degaServer }), ApolloServerPluginLandingPageDisabled()] :
    [ApolloServerPluginDrainHttpServer({ httpServer: degaServer })];
    
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    //tell Express to attach GraphQL functionality to the server
    plugins: plugins,
    context: async ({ req }) => {
      // get the user token from the headers
      const apiKey = req.headers.authorization || '';

      // try to retrieve a user with the token
      const isValidToken = verifyToken(API_KEY, apiKey);

      if (!isValidToken)
        throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });

      // add the apiKey to the context
      return { apiKey };
    }
  }) as any;

  await server.start(); //start the GraphQL server.

  server.applyMiddleware({ app });

  await new Promise<void>(
    (resolve) => degaServer.listen({ port: APP_PORT }, resolve) //run the server on port specefied in env
  );
  console.log(
    `Server ready at http://localhost:${APP_PORT}${server.graphqlPath}`
  );
}

const typeDefs = fs
  .readFileSync(path.join(__dirname, "schema/schema.graphql"), "utf8")
  .toString();
const schema = gql(typeDefs);
//in the end, run the server and pass in our Schema and Resolver.
startApolloServer(schema, resolvers);

