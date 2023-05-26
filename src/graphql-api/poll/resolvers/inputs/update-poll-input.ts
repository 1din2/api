import { Field, ID, InputType, Int } from "type-graphql";
import { UpdatePollInput } from "../../../../domain/poll/usecase/update-poll-usecase";
import { EntityId } from "../../../../domain/base/entity";
import { BigIntType } from "../../../base/types/big-int";

@InputType("InputUpdatePoll")
export class InputUpdatePoll implements UpdatePollInput {
  @Field(() => ID)
  id!: EntityId;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageId?: string;

  @Field(() => Int, { nullable: true })
  maxSelect?: number;

  @Field(() => Int, { nullable: true })
  minSelect?: number;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => BigIntType, { nullable: true })
  endsAt?: number;

  @Field(() => [String], { nullable: true })
  tags?: string[];
}
