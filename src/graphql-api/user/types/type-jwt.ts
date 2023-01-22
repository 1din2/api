import { ObjectType, Field } from "type-graphql";

@ObjectType("JWT")
export class TypeJwt {
  @Field({ description: "User id" })
  public id!: string;

  @Field({
    description: `A JSON Web Token used for authentication.
			The server expects it in the Bearer token format,
			which is in the Authorization header.`,
  })
  public token!: string;
}
