import {
  Resolver,
  Ctx,
  Query,
  Arg,
  ID,
  FieldResolver,
  Root,
  Int,
} from "type-graphql";
import { ApiContext } from "../../../container/api-context";
import { TypePoll } from "../types/poll-type";
import { EntityId } from "../../../domain/base/entity";
import { TypePollOption } from "../types/poll-option-type";
import { Poll } from "../../../domain/poll/entity/poll";

@Resolver(() => TypePoll)
export default class PollResolver {
  @Query(() => TypePoll, { nullable: true, description: "Get poll by id" })
  pollById(@Arg("id", () => ID) id: EntityId, @Ctx() { services }: ApiContext) {
    return services.poll.findById(id);
  }

  @Query(() => TypePoll, { nullable: true, description: "Get poll by slug" })
  pollBySlug(
    @Arg("slug", () => ID) slug: EntityId,
    @Ctx() { services, project }: ApiContext
  ) {
    return services.poll.findBySlug({ slug, project });
  }

  @FieldResolver(() => [TypePollOption], { description: "Get poll options" })
  options(@Root() root: Poll, @Ctx() { services }: ApiContext) {
    return services.pollOption.findByPollId(root.id);
  }

  @FieldResolver(() => Int, { description: "Get votes count" })
  votesCount(@Root() root: Poll, @Ctx() { services }: ApiContext) {
    return services.pollOptionVote.countVotes({ pollId: root.id });
  }
}
