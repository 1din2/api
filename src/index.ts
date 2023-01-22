import startApolloServer from "./graphql-api/api";

async function bootstrap() {
  await startApolloServer();
}

bootstrap().catch(console.error);
