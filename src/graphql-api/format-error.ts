/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from "apollo-server-express";
import { DomainError } from "../domain/base/errors";

function transformError(error: any) {
  if (error instanceof ApolloError) return error;
  if (error.name === "GraphQLError") return error;

  const graphqlError: any = error;
  if (error instanceof DomainError) {
    graphqlError.extensions = { code: error.errorCode };
  }

  if (graphqlError.data) graphqlError.data = JSON.stringify(graphqlError.data);

  return graphqlError;
}

function logError(error: any) {
  if (error.isAxiosError) console.error(error.message, error.config);
  else console.error(error);
}

export default (error: Error) => {
  logError(error);
  return transformError(error);
};
