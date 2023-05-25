import { EntityId } from "../../domain/base/entity";
import { JsonValidator } from "../../domain/base/validator";
import {
  PollOption,
  PollOptionData,
} from "../../domain/poll/entity/poll-option";
import { PollOptionService } from "../../domain/poll/service/poll-option-service";
import { DbRepository } from "../db/repository";

export class PollOptionDbService
  extends DbRepository<PollOptionData, PollOption>
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

  override toEntity(data: PollOptionData) {
    return new PollOption(data);
  }

  async findByPollId(pollId: EntityId): Promise<PollOption[]> {
    const items = await this.query().where({ pollId }).orderBy("priority");

    return this.toEntities(items);
  }
}
