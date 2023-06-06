import { Field, ID, ObjectType } from "type-graphql";
import { TypeBaseEntity } from "../../base/types/types";
import { PollOptionVoteData } from "../../../domain/poll/entity/poll-option-vote";

@ObjectType("PollVote")
export class TypePollVote
  extends TypeBaseEntity
  implements Omit<PollOptionVoteData, "userId" | "ip">
{
  @Field(() => ID)
  pollId!: string;

  @Field(() => ID)
  pollOptionId!: string;
}
