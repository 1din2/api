import { Repository } from "../../base/repository";
import { Poll, PollData } from "../entity/poll";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PollService extends Repository<PollData, Poll> {}
