import { Repository } from "../../base/repository";
import { Poll, PollData, PollStatus } from "../entity/poll";

export interface FindPollBySlugParams {
  slug: string;
  project: string;
}

export interface FindPollParams {
  limit?: number;
  offset?: number;
  project?: string;
  status?: PollStatus[];
  tag?: string;
}

export interface PollGenerateParams {
  language: string;
  info?: string;
}

export interface PollGenerateTextData {
  title: string;
  description?: string;
  tags?: string[];
}

export interface PollGenerateOptionData extends PollGenerateTextData {
  textToSearchImage?: string;
}

export interface PollGenerateData extends PollGenerateTextData {
  language: string;
  options: PollGenerateOptionData[];
}

export interface PollService extends Repository<PollData, Poll> {
  findBySlug(params: FindPollBySlugParams): Promise<Poll | null>;
  find(params: FindPollParams): Promise<Poll[]>;
  generatePoll(params: PollGenerateParams): Promise<PollGenerateData>;
}
