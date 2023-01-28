import { JsonValidator } from "../../domain/base/validator";
import { PollData, pollJsonSchema } from "../../domain/poll/entity/poll";
import { PollService } from "../../domain/poll/service/poll-service";
import { DbRepository } from "../db/repository";

export class PollDbService
  extends DbRepository<PollData>
  implements PollService
{
  constructor() {
    super("Poll", {
      createValidator: new JsonValidator(pollJsonSchema),
      updateValidator: new JsonValidator({
        ...pollJsonSchema,
        required: ["id"],
      }),
    });
  }
}
