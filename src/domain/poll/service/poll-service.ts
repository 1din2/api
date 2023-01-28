import { Repository } from "../../base/repository";
import { PollData } from "../entity/poll";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PollService extends Repository<PollData> {}
