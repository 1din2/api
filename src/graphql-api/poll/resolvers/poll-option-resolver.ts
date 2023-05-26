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
import { InputSavePollOption } from "./inputs/save-poll-option-input";
import { SavePollOptionInput } from "../../../domain/poll/usecase/save-poll-option-usecase";

@Resolver(() => TypePollOption)
export default class PollOptionResolver {
  @Mutation(() => TypePollOption, { description: "Save poll option" })
  savePollOption(
    @Arg("input", () => InputSavePollOption) input: SavePollOptionInput,
    @Ctx() context: ApiContext
  ) {
    return context.usecases.savePollOption.execute(input, context);
  }

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