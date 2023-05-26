import { pick } from "ramda";
import { RequiredJSONSchema } from "../../base/json-schema";
import { slugify } from "../../base/util";
import { UserRole } from "../../user/entity/user";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import { Poll, PollData, PollUpdateData } from "../entity/poll";
import { PollService } from "../service/poll-service";
import { EntityId } from "../../base/entity";
import { Tag } from "../entity/tag";
import { SavePollTagsUseCase } from "./save-poll-tags-usecase";

export type UpdatePollInput = Partial<
  Pick<
    PollData,
    | "title"
    | "description"
    | "imageId"
    | "maxSelect"
    | "minSelect"
    | "slug"
    | "endsAt"
  >
> & { id: EntityId } & { tags?: string[] };

export class UpdatePollUseCase extends AuthUseCase<UpdatePollInput, Poll> {
  constructor(
    private pollService: PollService,
    private saveTags: SavePollTagsUseCase
  ) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(
    input: UpdatePollInput,
    context: AuthDomainContext
  ): Promise<Poll> {
    const updateData: PollUpdateData = {
      ...input,
    };

    if (updateData.slug) updateData.slug = slugify(updateData.slug);

    const poll = await this.pollService.update(updateData);

    if (input.tags)
      await this.saveTags.execute(
        {
          pollId: poll.id,
          data: [{ tags: input.tags.map((name) => ({ name })) }],
        },
        context
      );

    return poll;
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...pick(
        [
          "id",
          "title",
          "description",
          "imageId",
          "maxSelect",
          "minSelect",
          "slug",
          "endsAt",
        ],
        Poll.jsonSchema.properties
      ),
      tags: {
        type: "array",
        items: Tag.jsonSchema.properties.name,
        uniqueItems: true,
        minItems: 0,
        maxItems: 5,
      },
    },
    required: ["id"],
    additionalProperties: false,
  };
}
