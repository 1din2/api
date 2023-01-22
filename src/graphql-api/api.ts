import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import express from "express";
import http from "http";
import configuration from "../container/configuration";
import createSchema from "./create-schema";
import { createApiContext } from "../container/api-context";

async function startApolloServer() {
  const schema = await createSchema();
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    context: ({ req }) => createApiContext(req),
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginCacheControl({
        defaultMaxAge: 1000,
        calculateHttpHeaders: true,
      }),
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: { "editor.theme": "light" },
      }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app });
  app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: configuration.port }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${configuration.port}${server.graphqlPath}`
  );
}

export default startApolloServer;
