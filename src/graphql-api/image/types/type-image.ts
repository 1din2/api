import { Field, Int, ObjectType } from "type-graphql";
import { ImageData } from "../../../domain/image/entity/image";
import { TypeBaseEntity } from "../../base/types/types";

@ObjectType()
export class TypeImage
  extends TypeBaseEntity
  implements Omit<ImageData, "userId" | "provider">
{
  @Field()
  url?: string;

  @Field()
  contentType!: string;

  @Field()
  hash!: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Int)
  height!: number;

  @Field(() => Int)
  width!: number;

  @Field({ nullable: true })
  originalName?: string;

  @Field(() => Int, { nullable: true })
  length?: number;

  @Field({ nullable: true })
  content?: string;
}
