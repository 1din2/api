import { EntityCreateData } from "../../domain/base/entity";
import { JsonValidator } from "../../domain/base/validator";
import { Poll, PollData } from "../../domain/poll/entity/poll";
import {
  FindPollBySlugParams,
  PollService,
} from "../../domain/poll/service/poll-service";
import { DbRepository } from "../db/repository";

export class PollDbService
  extends DbRepository<PollData, Poll>
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

  async findBySlug({
    project,
    slug,
  }: FindPollBySlugParams): Promise<Poll | null> {
    const item = await this.query().where({ project, slug }).first();

    return item ? this.toEntity(item) : null;
  }

  public override async findUnique(
    data: EntityCreateData<PollData>
  ): Promise<Poll | null> {
    const item = await this.findBySlug(data);
    if (item) return item;

    return super.findUnique(data);
  }

  override toEntity(data: PollData): Poll {
    return new Poll(data);
  }
}
