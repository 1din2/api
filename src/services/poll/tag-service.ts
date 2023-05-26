import { EntityCreateData } from "../../domain/base/entity";
import { Tag, TagData } from "../../domain/poll/entity/tag";
import {
  FindOneTagBySlugParams,
  TagService,
} from "../../domain/poll/service/tag-service";
import { DbRepository } from "../db/repository";

export class TagDbService
  extends DbRepository<TagData, Tag>
  implements TagService
{
  constructor() {
    super(Tag);
  }

  async findByPollId(pollId: string): Promise<Tag[]> {
    const items = await this.query().whereExists((builder) =>
      builder
        .from("PollTag")
        .select(this.knex.raw(1))
        .whereRaw("PollTag.tagId = Tag.id")
        .where({ pollId })
    );

    return this.toEntities(items);
  }

  async findOneBySlug({
    language,
    slug,
  }: FindOneTagBySlugParams): Promise<Tag | null> {
    const item = await this.query().where({ language, slug }).first();

    return item ? this.toEntity(item) : null;
  }

  public override async findUnique(
    data: EntityCreateData<TagData>
  ): Promise<Tag | null> {
    const item = await this.findOneBySlug(data);
    if (item) return item;

    return super.findUnique(data);
  }

  override toEntity(data: TagData): Tag {
    return new Tag(data);
  }
}
