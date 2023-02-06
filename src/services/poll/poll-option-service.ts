import { JsonValidator } from "../../domain/base/validator";
import {
  PollOptionData,
  pollOptionJsonSchema,
} from "../../domain/poll/entity/poll-option";
import { PollOptionService } from "../../domain/poll/service/poll-option-service";
import { DbRepository } from "../db/repository";

export class PollOptionDbService
  extends DbRepository<PollOptionData>
  implements PollOptionService
{
  constructor() {
    super("PollOption", {
      createValidator: new JsonValidator(pollOptionJsonSchema),
      updateValidator: new JsonValidator({
        ...pollOptionJsonSchema,
        required: ["id"],
      }),
    });
  }

  getByPollId(pollId: number): Promise<PollOptionData[]> {
    return this.query.where({ pollId }).orderBy("priority");
  }
}
