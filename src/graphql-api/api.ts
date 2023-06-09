import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import http from "http";
import { Express } from "express";
import createSchema from "./create-schema";

async function startApolloServer(app: Express, httpServer: http.Server) {
  const schema = await createSchema();
  const server = new ApolloServer({
    context: ({ req }) => req.apiContext,
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
    introspection: true,
  });

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  return server;
}

export default startApolloServer;
