import { EntityId } from "../../domain/base/entity";
import { JsonValidator } from "../../domain/base/validator";
import {
  PollOption,
  PollOptionData,
} from "../../domain/poll/entity/poll-option";
import { PollOptionService } from "../../domain/poll/service/poll-option-service";
import { DbRepository } from "../db/repository";

export class PollOptionDbService
  extends DbRepository<PollOptionData>
  implements PollOptionService
{
  constructor() {
    super("PollOption", {
      createValidator: new JsonValidator(PollOption.jsonSchema),
      updateValidator: new JsonValidator({
        ...PollOption.jsonSchema,
        required: ["id"],
      }),
    });
  }

  getByPollId(pollId: EntityId): Promise<PollOptionData[]> {
    return this.query.where({ pollId }).orderBy("priority");
  }
}
