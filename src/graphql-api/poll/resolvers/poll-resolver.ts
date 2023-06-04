import {
  Resolver,
  Ctx,
  Query,
  Arg,
  ID,
  FieldResolver,
  Root,
  Int,
  Mutation,
} from "type-graphql";
import { ApiContext } from "../../../container/api-context";
import { TypePoll } from "../types/poll-type";
import { EntityId } from "../../../domain/base/entity";
import { TypePollOption } from "../types/poll-option-type";
import { Poll, PollStatus } from "../../../domain/poll/entity/poll";
import { ForbiddenError, InvalidInputError } from "../../../domain/base/errors";
import { UserRole } from "../../../domain/user/entity/user";
import { CreatePollInput } from "../../../domain/poll/usecase/create-poll-usecase";
import { InputCreatePoll } from "./inputs/create-poll-input";
import { checkUserRole } from "../../auth";
import { UpdatePollInput } from "../../../domain/poll/usecase/update-poll-usecase";
import { InputUpdatePoll } from "./inputs/update-poll-input";
import { slugify } from "../../../domain/base/util";
import { TypeTag } from "../types/tag-type";
import configuration from "../../../container/configuration";

@Resolver(() => TypePoll)
export default class PollResolver {
  @Mutation(() => TypePoll, { description: "Create a poll" })
  createPoll(
    @Arg("input", () => InputCreatePoll) input: CreatePollInput,
    @Ctx() context: ApiContext
  ) {
    return context.usecases.createPoll.execute(input, context);
  }

  @Mutation(() => TypePoll, { description: "Update a poll" })
  updatePoll(
    @Arg("input", () => InputUpdatePoll) input: UpdatePollInput,
    @Ctx() context: ApiContext
  ) {
    return context.usecases.updatePoll.execute(input, context);
  }

  @Mutation(() => TypePoll, { nullable: true, description: "Delete a poll" })
  deletePoll(@Arg("id", () => ID) id: EntityId, @Ctx() context: ApiContext) {
    checkUserRole(context, UserRole.ADMIN);
    return context.services.poll.deleteById(id);
  }

  @Mutation(() => TypePoll, { description: "Set poll status" })
  setPollStatus(
    @Arg("id", () => ID) id: EntityId,
    @Arg("status", () => PollStatus) status: PollStatus,
    @Ctx() context: ApiContext
  ) {
    checkUserRole(context, UserRole.ADMIN);
    return context.usecases.setPollStatus.execute({ id, status }, context);
  }

  @Mutation(() => TypePoll, { description: "Generate poll" })
  generatePoll(
    @Ctx() context: ApiContext,
    @Arg("language", () => String) language: string,
    @Arg("news", () => String, { nullable: true }) news?: string
  ) {
    checkUserRole(context, UserRole.ADMIN);
    return context.usecases.generatePoll.execute({ language, news }, context);
  }

  @Query(() => [TypePoll], { nullable: true, description: "Find polls" })
  findPollList(
    @Ctx() { services, currentUser, project }: ApiContext,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("offset", () => Int, { nullable: true }) offset?: number,
    @Arg("status", () => [PollStatus], { nullable: true })
    status?: PollStatus[],
    @Arg("tag", () => String, { nullable: true }) tag?: string
  ) {
    if (limit && (limit > 50 || limit < 0))
      throw new InvalidInputError("Limit must be between 0 and 50");

    if (offset && offset < 0)
      throw new InvalidInputError("Offset must be greater than 0");

    if (offset) {
      if (!currentUser && offset > 1)
        throw new ForbiddenError("Offset must be between 0 and 2");

      if (currentUser && currentUser.role === UserRole.USER && offset > 1)
        throw new ForbiddenError("Offset must be between 0 and 2");
    }
    if (configuration.isProduction) {
      status =
        currentUser && currentUser.role === UserRole.ADMIN
          ? status
          : [PollStatus.ACTIVE];
    }

    if (tag) tag = slugify(tag);

    return services.poll.find({ project, limit, offset, status, tag });
  }

  @Query(() => TypePoll, { nullable: true, description: "Get poll by id" })
  pollById(@Arg("id", () => ID) id: EntityId, @Ctx() { services }: ApiContext) {
    return services.poll.findById(id);
  }

  @Query(() => TypePoll, { nullable: true, description: "Get poll by slug" })
  pollBySlug(
    @Arg("slug", () => String) slug: EntityId,
    @Ctx() { services, project }: ApiContext
  ) {
    if (!project) throw new InvalidInputError("Project is required");
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

  @FieldResolver(() => [TypeTag], { description: "Get poll tags" })
  tags(@Root() root: Poll, @Ctx() { services }: ApiContext) {
    return services.tag.findByPollId(root.id);
  }
}
