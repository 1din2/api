import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { PollTagData, PollTag } from "../entity/poll-tag";

export type FindOneByPollIdParams = {
  pollId: EntityId;
  tagId: EntityId;
};

export interface PollTagService extends Repository<PollTagData, PollTag> {
  findByPollId(pollId: EntityId): Promise<PollTag[]>;
  findByPollOptionId(pollOptionId: EntityId): Promise<PollTag[]>;
  findOneByPollId(params: FindOneByPollIdParams): Promise<PollTag | null>;
}
