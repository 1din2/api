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
  userId?: EntityId;

  limit?: number;
  offset?: number;
}

export interface FindVoteByUserOptionParams {
  pollOptionId: EntityId;
  userId: EntityId;
}

export interface PollOptionVoteService
  extends Repository<PollOptionVoteData, PollOptionVote> {
  countVotes(params: CountPollOptionVoteParams): Promise<number>;
  find(params: FindVoteParams): Promise<PollOptionVote[]>;
  findByUserOption(
    params: FindVoteByUserOptionParams
  ): Promise<PollOptionVote | null>;
}
