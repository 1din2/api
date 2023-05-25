import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";
import { TypeBaseEntity } from "../../base/types/types";
import {
  PollData,
  PollStatus,
  PollType,
} from "../../../domain/poll/entity/poll";
import { BigIntType } from "../../base/types/big-int";
import { EntityId } from "../../../domain/base/entity";

registerEnumType(PollStatus, { name: "PollStatus" });
registerEnumType(PollType, { name: "PollType" });

@ObjectType("Poll")
export class TypePoll
  extends TypeBaseEntity
  implements Omit<PollData, "userId">
{
  @Field()
  project!: string;

  @Field(() => PollStatus)
  status!: PollStatus;

  @Field()
  language!: string;

  @Field(() => PollType)
  type!: PollType;

  @Field(() => BigIntType)
  endsAt!: number;

  @Field()
  slug!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => Int)
  minSelect!: number;

  @Field(() => Int)
  maxSelect!: number;

  @Field(() => ID, { nullable: true })
  imageId?: EntityId;
}
