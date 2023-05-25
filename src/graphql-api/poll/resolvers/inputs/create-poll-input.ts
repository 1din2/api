import { Field, InputType, Int } from "type-graphql";
import { CreatePollInput } from "../../../../domain/poll/usecase/create-poll-usecase";
import { PollType } from "../../../../domain/poll/entity/poll";
import { BigIntType } from "../../../base/types/big-int";

@InputType("InputCreatePoll")
export class InputCreatePoll implements CreatePollInput {
  @Field()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  imageId?: string;

  @Field()
  language!: string;

  @Field(() => Int)
  maxSelect!: number;

  @Field(() => Int)
  minSelect!: number;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => BigIntType, { nullable: true })
  endsAt?: number;

  @Field(() => PollType)
  type!: PollType;
}
