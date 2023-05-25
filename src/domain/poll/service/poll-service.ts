import { Repository } from "../../base/repository";
import { Poll, PollData } from "../entity/poll";

export interface FindPollBySlugParams {
  slug: string;
  project: string;
}

export interface PollService extends Repository<PollData, Poll> {
  findBySlug(params: FindPollBySlugParams): Promise<Poll | null>;
}
