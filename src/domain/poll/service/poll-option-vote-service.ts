import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { PollOptionVote, PollOptionVoteData } from "../entity/poll-option-vote";

export interface CountPollOptionVoteParams {
  pollId?: EntityId;
  pollOptionId?: EntityId;
}

export interface FindVoteParams {
  pollId?: EntityId;
  pollOptionId?: EntityId;
  voterId?: EntityId;

  limit?: number;
  offset?: number;
}

export interface FindVoteByUserOptionParams {
  pollOptionId: EntityId;
  voterId: EntityId;
}

export interface PollOptionVoteService
  extends Repository<PollOptionVoteData, PollOptionVote> {
  countVotes(params: CountPollOptionVoteParams): Promise<number>;
  find(params: FindVoteParams): Promise<PollOptionVote[]>;
  findByVoterOption(
    params: FindVoteByUserOptionParams
  ): Promise<PollOptionVote | null>;
}
