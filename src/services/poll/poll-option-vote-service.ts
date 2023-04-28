import { JsonValidator } from "../../domain/base/validator";
import {
  PollOptionVote,
  PollOptionVoteData,
} from "../../domain/poll/entity/poll-option-vote";
import {
  CountPollOptionVoteParams,
  PollOptionVoteService,
} from "../../domain/poll/service/poll-option-vote-service";
import { DbRepository } from "../db/repository";

export class PollOptionVoteDbService
  extends DbRepository<PollOptionVoteData>
  implements PollOptionVoteService
{
  constructor() {
    super("PollOptionVote", {
      createValidator: new JsonValidator(PollOptionVote.jsonSchema),
      updateValidator: new JsonValidator({
        ...PollOptionVote.jsonSchema,
        required: ["id"],
      }),
    });
  }

  async countVotes({
    pollId,
    pollOptionId,
  }: CountPollOptionVoteParams): Promise<number> {
    const query = this.query.count("userId").as("total").where({ pollId });
    if (pollOptionId) query.where({ pollOptionId });
    const item = await query.first();
    return item ? parseInt(item.total.toString(), 10) : 0;
  }
}
