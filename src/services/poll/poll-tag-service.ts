import { EntityCreateData } from "../../domain/base/entity";
import { PollTag, PollTagData } from "../../domain/poll/entity/poll-tag";
import {
  FindOneByPollIdParams,
  PollTagService,
} from "../../domain/poll/service/poll-tag-service";
import { DbRepository } from "../db/repository";

export class PollTagDbService
  extends DbRepository<PollTagData, PollTag>
  implements PollTagService
{
  constructor() {
    super(PollTag);
  }

  async findByPollOptionId(pollOptionId: string): Promise<PollTag[]> {
    const items = await this.query().where({ pollOptionId });

    return this.toEntities(items);
  }

  async findOneByPollId(
    params: FindOneByPollIdParams
  ): Promise<PollTag | null> {
    const item = await this.query().where(params).first();

    return item ? this.toEntity(item) : null;
  }

  async findByPollId(pollId: string): Promise<PollTag[]> {
    const items = await this.query().where({ pollId });

    return this.toEntities(items);
  }

  public override async findUnique(
    data: EntityCreateData<PollTagData>
  ): Promise<PollTag | null> {
    const item = await this.findOneByPollId(data);
    if (item) return item;

    return super.findUnique(data);
  }

  override toEntity(data: PollTagData): PollTag {
    return new PollTag(data);
  }
}
