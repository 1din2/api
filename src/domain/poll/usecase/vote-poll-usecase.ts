import { EntityId } from "../../base/entity";
import { InvalidInputError } from "../../base/errors";
import { RequiredJSONSchema } from "../../base/json-schema";
import { uniq } from "../../base/util";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import { PollOption } from "../entity/poll-option";
import {
  PollOptionVote,
  PollOptionVoteCreateData,
} from "../entity/poll-option-vote";
import { PollOptionService } from "../service/poll-option-service";
import { PollOptionVoteService } from "../service/poll-option-vote-service";
import { PollService } from "../service/poll-service";

export interface VotePollInput {
  pollOptionIds: EntityId[];
}

export class VotePollUseCase extends AuthUseCase<VotePollInput, PollOption[]> {
  constructor(
    private pollService: PollService,
    private pollOptionService: PollOptionService,
    private pollOptionVoteService: PollOptionVoteService
  ) {
    super();
  }

  protected override async innerExecute(
    { pollOptionIds }: VotePollInput,
    { currentUser, ip }: AuthDomainContext
  ): Promise<PollOption[]> {
    const pollOptions = await this.pollOptionService.findByIds(pollOptionIds);
    const pollIds = uniq(pollOptions.map((po) => po.pollId));
    if (pollOptions.length !== pollOptionIds.length || pollIds.length !== 1)
      throw new InvalidInputError("Invalid poll option ids");

    const pollId = pollIds[0];

    const poll = await this.pollService.checkById(pollId);

    if (
      pollOptionIds.length < poll.minSelect ||
      pollOptionIds.length > poll.maxSelect
    )
      throw new InvalidInputError("Invalid poll option ids count");

    const existing = await this.pollOptionVoteService.find({
      userId: currentUser.id,
      pollId,
    });

    await this.pollOptionService.transaction(async (trx) => {
      await this.pollOptionVoteService.deleteByIds(
        existing.map((e) => e.id),
        trx
      );

      await this.pollOptionVoteService.createMany(
        pollOptionIds.map<PollOptionVoteCreateData>(
          (pollOptionId) => ({
            pollOptionId,
            pollId,
            userId: currentUser.id,
            id: PollOptionVote.createId(),
            ip,
          }),
          trx
        )
      );
    });

    return pollOptions;
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      pollOptionIds: {
        type: "array",
        items: PollOption.jsonSchema.properties.id,
        minItems: 1,
        maxItems: 10,
        uniqueItems: true,
      },
    },
    required: ["pollOptionIds"],
    additionalProperties: false,
  };
}
