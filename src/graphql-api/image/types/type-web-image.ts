import { Field, Int, ObjectType } from "type-graphql";
import { TypeBaseEntity } from "../../base/types/types";
import { WebImageData } from "../../../domain/image/entity/web-image";

@ObjectType()
export class TypeWebImage extends TypeBaseEntity implements WebImageData {
  @Field()
  url!: string;

  @Field()
  contentType!: string;

  @Field()
  urlHash!: string;

  @Field(() => Int)
  height!: number;

  @Field(() => Int)
  width!: number;

  @Field({ nullable: true })
  hostname!: string;
}
