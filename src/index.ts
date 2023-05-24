import configuration from "./container/configuration";
import startApolloServer from "./graphql-api/api";
import server from "./server";

async function bootstrap() {
  const { app, httpServer } = server();
  const api = await startApolloServer(app, httpServer);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: configuration.port }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${configuration.port}${api.graphqlPath}`
  );
}

bootstrap().catch(console.error);
