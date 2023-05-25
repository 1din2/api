import {
  Resolver,
  Ctx,
  FieldResolver,
  Root,
  Int,
  Mutation,
  Arg,
  ID,
} from "type-graphql";
import { ApiContext } from "../../../container/api-context";
import { TypePollOption } from "../types/poll-option-type";
import { PollOption } from "../../../domain/poll/entity/poll-option";
import { EntityId } from "../../../domain/base/entity";

@Resolver(() => TypePollOption)
export default class PollOptionResolver {
  @FieldResolver(() => Int, { description: "Get votes count" })
  votesCount(@Root() root: PollOption, @Ctx() { services }: ApiContext) {
    return services.pollOptionVote.countVotes({ pollOptionId: root.id });
  }

  @Mutation(() => [TypePollOption], { description: "Vote for poll options" })
  voteOptions(
    @Arg("pollOptionIds", () => [ID]) pollOptionIds: EntityId[],
    @Ctx() context: ApiContext
  ) {
    return context.usecases.votePoll.execute({ pollOptionIds }, context);
  }
}
