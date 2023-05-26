import { EntityId } from "../../base/entity";
import { Repository } from "../../base/repository";
import { Tag, TagCreateData, TagData, TagUpdateData } from "../entity/tag";

export type FindOneTagBySlugParams = {
  slug: string;
  language: string;
};

export interface TagService
  extends Repository<TagData, Tag, TagCreateData, TagUpdateData> {
  findByPollId(pollId: EntityId): Promise<Tag[]>;
  findOneBySlug(params: FindOneTagBySlugParams): Promise<Tag | null>;
}
