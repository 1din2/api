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
import { TypeWebImage } from "../../image/types/type-web-image";
import { TypePoll } from "../types/poll-type";

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

  @Mutation(() => TypePoll, { description: "Vote for poll options" })
  vote(
    @Arg("pollOptionIds", () => [ID]) pollOptionIds: EntityId[],
    @Ctx() context: ApiContext
  ) {
    return context.usecases.votePoll.execute({ pollOptionIds }, context);
  }

  @FieldResolver(() => [TypeWebImage], { description: "Get web images" })
  webImages(@Root() root: PollOption, @Ctx() { services }: ApiContext) {
    return services.webImage.find({ pollOptionId: root.id });
  }
}
