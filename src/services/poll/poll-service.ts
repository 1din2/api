import { JsonValidator } from "../../domain/base/validator";
import { Poll, PollData } from "../../domain/poll/entity/poll";
import { PollService } from "../../domain/poll/service/poll-service";
import { DbRepository } from "../db/repository";

export class PollDbService
  extends DbRepository<PollData>
  implements PollService
{
  constructor() {
    super("Poll", {
      createValidator: new JsonValidator(Poll.jsonSchema),
      updateValidator: new JsonValidator({
        ...Poll.jsonSchema,
        required: ["id"],
      }),
    });
  }
}
