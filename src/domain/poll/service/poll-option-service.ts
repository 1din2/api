import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { PollOption, PollOptionData } from "../entity/poll-option";

export interface PollOptionService
  extends Repository<PollOptionData, PollOption> {
  findByPollId(pollId: EntityId): Promise<PollOption[]>;
}
