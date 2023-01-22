import schemaResolvers from "./schema-resolvers";
import { buildSchema } from "type-graphql";

export default async () =>
  buildSchema({
    resolvers: schemaResolvers as never,
    dateScalarMode: "timestamp",
    validate: false,
  });
