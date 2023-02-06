import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { PollOptionData } from "../entity/poll-option";

export interface PollOptionService extends Repository<PollOptionData> {
  getByPollId(pollId: EntityId): Promise<PollOptionData[]>;
}
