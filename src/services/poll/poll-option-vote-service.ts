import {
  PollOptionVote,
  PollOptionVoteCreateData,
  PollOptionVoteData,
} from "../../domain/poll/entity/poll-option-vote";
import {
  CountPollOptionVoteParams,
  FindVoteByUserOptionParams,
  FindVoteParams,
  PollOptionVoteService,
} from "../../domain/poll/service/poll-option-vote-service";
import { DbRepository } from "../db/repository";

export class PollOptionVoteDbService
  extends DbRepository<PollOptionVoteData, PollOptionVote>
  implements PollOptionVoteService
{
  constructor() {
    super(PollOptionVote);
  }

  async find({
    limit,
    offset,
    pollId,
    pollOptionId,
    userId,
  }: FindVoteParams): Promise<PollOptionVote[]> {
    const query = this.query()
      .limit(limit || 10)
      .offset(offset || 0);
    if (pollId) query.where({ pollId });
    if (pollOptionId) query.where({ pollOptionId });
    if (userId) query.where({ userId });

    const items = await query.orderBy("id", "desc");

    return this.toEntities(items);
  }

  override toEntity(data: PollOptionVoteData): PollOptionVote {
    return new PollOptionVote(data);
  }

  async countVotes({
    pollId,
    pollOptionId,
  }: CountPollOptionVoteParams): Promise<number> {
    const query = this.query().countDistinct("userId", { as: "total" });
    if (pollId) query.where({ pollId });
    if (pollOptionId) query.where({ pollOptionId });
    const item = await query.first();
    return item ? parseInt(item.total.toString(), 10) : 0;
  }

  async findByUserOption({
    userId,
    pollOptionId,
  }: FindVoteByUserOptionParams): Promise<PollOptionVote | null> {
    const item = await this.query().where({ userId, pollOptionId }).first();

    return item ? this.toEntity(item) : null;
  }

  public override async findUnique(
    data: PollOptionVoteCreateData
  ): Promise<PollOptionVote | null> {
    const item = await this.findByUserOption(data);
    if (item) return item;

    return super.findUnique(data);
  }
}
