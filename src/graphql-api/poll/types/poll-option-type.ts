import { Field, ID, Int, ObjectType } from "type-graphql";
import { TypeBaseEntity } from "../../base/types/types";
import { PollOptionData } from "../../../domain/poll/entity/poll-option";
import { EntityId } from "../../../domain/base/entity";

@ObjectType("PollOption")
export class TypePollOption extends TypeBaseEntity implements PollOptionData {
  @Field(() => Int)
  priority!: number;

  @Field(() => ID, { nullable: true })
  imageId?: EntityId;

  @Field(() => ID)
  pollId!: EntityId;

  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;
}
