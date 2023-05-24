import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { PollOptionVote, PollOptionVoteData } from "../entity/poll-option-vote";

export interface CountPollOptionVoteParams {
  pollId: EntityId;
  pollOptionId?: EntityId;
}

export interface PollOptionVoteService
  extends Repository<PollOptionVoteData, PollOptionVote> {
  countVotes(params: CountPollOptionVoteParams): Promise<number>;
}
