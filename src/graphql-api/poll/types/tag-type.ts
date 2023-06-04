import { Field, ObjectType } from "type-graphql";
import { TypeBaseEntity } from "../../base/types/types";
import { TagData } from "../../../domain/poll/entity/tag";

@ObjectType("Tag")
export class TypeTag extends TypeBaseEntity implements TagData {
  @Field()
  slug!: string;

  @Field()
  language!: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  name!: string;
}
