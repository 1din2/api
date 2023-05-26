import { EntityId } from "../../base/entity";
import { RequiredJSONSchema } from "../../base/json-schema";
import { slugify } from "../../base/util";
import { UserRole } from "../../user/entity/user";
import { AuthUseCase } from "../../user/usecase/auth-usercase";
import { Poll } from "../entity/poll";
import { PollTag, PollTagCreateData } from "../entity/poll-tag";
import { Tag, TagCreateData } from "../entity/tag";
import { PollService } from "../service/poll-service";
import { PollTagService } from "../service/poll-tag-service";
import { TagService } from "../service/tag-service";

export interface SavePollTagsInput {
  pollId: EntityId;
  data: {
    pollOptionId?: EntityId;
    tags: { name: string }[];
  }[];
}

export class SavePollTagsUseCase extends AuthUseCase<
  SavePollTagsInput,
  PollTag[]
> {
  constructor(
    private pollService: PollService,
    private tagService: TagService,
    private pollTagService: PollTagService
  ) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(input: SavePollTagsInput) {
    const { language } = await this.pollService.checkById(input.pollId);
    const output: PollTag[] = [];
    const existingTags = await this.pollTagService.findByPollId(input.pollId);
    for (const data of input.data) {
      const tags = await this.tagService.findOrCreateMany(
        data.tags.map<TagCreateData>((t) => ({
          name: t.name,
          slug: slugify(t.name),
          id: Tag.createId(),
          language,
        }))
      );

      const pollTags = await this.pollTagService.findOrCreateMany(
        tags.map<PollTagCreateData>((it) => ({
          pollId: input.pollId,
          pollOptionId: data.pollOptionId,
          tagId: it.id,
          id: PollTag.createId(),
        }))
      );

      output.push(...pollTags);
    }

    const oldTags = existingTags.filter(
      (it) => !output.find((t) => t.id === it.id)
    );

    if (oldTags.length > 0)
      await this.pollTagService.deleteByIds(oldTags.map((it) => it.id));

    return output;
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      pollId: Poll.jsonSchema.properties.id,
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            pollOptionId: { type: ["string", "null"] },
            tags: {
              type: "array",
              items: Tag.jsonSchema.properties.name,
              uniqueItems: true,
              minItems: 1,
              maxItems: 5,
            },
          },
          required: ["tags"],
          minItems: 0,
          maxItems: 5,
        },
      },
    },
    required: ["pollId", "data"],
  };
}
