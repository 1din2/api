import { pick } from "ramda";
import { InvalidInputError } from "../../base/errors";
import { RequiredJSONSchema } from "../../base/json-schema";
import { dateAddDays, slugify } from "../../base/util";
import { UserRole } from "../../user/entity/user";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import {
  Poll,
  PollCreateData,
  PollData,
  PollStatus,
  PollType,
} from "../entity/poll";
import { PollService } from "../service/poll-service";
import { Tag } from "../entity/tag";
import { SavePollTagsUseCase } from "./save-poll-tags-usecase";
import { EntityId } from "../../base/entity";

export type CreatePollInput = Pick<
  PollData,
  "title" | "description" | "imageId" | "language"
> &
  Partial<
    Pick<PollData, "slug" | "endsAt" | "maxSelect" | "minSelect" | "type">
  > & {
    tags?: string[];
    id?: EntityId;
  };

export class CreatePollUseCase extends AuthUseCase<CreatePollInput, Poll> {
  constructor(
    private pollService: PollService,
    private saveTags: SavePollTagsUseCase
  ) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(
    { tags, ...input }: CreatePollInput,
    context: AuthDomainContext
  ): Promise<Poll> {
    const { currentUser, project } = context;
    if (!project) throw new InvalidInputError("Invalid project");

    const slug = slugify(input.slug || input.title);
    const endsAt = input.endsAt || dateAddDays(90).toISOString();
    const type = input.type || PollType.SELECT;
    const maxSelect = input.maxSelect || 1;
    const minSelect = input.minSelect || 1;

    const existing = await this.pollService.findBySlug({ project, slug });
    if (existing) throw new InvalidInputError("Poll already exists");

    const createData: PollCreateData = {
      id: Poll.createId(),
      ...input,
      slug,
      endsAt,
      project,
      userId: currentUser.id,
      type,
      status: PollStatus.DRAFT,
      maxSelect,
      minSelect,
    };

    const poll = await this.pollService.create(createData);

    if (tags)
      await this.saveTags.execute(
        {
          pollId: poll.id,
          data: [{ tags: tags.map((name) => ({ name })) }],
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
          "language",
          "maxSelect",
          "minSelect",
          "type",
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
    required: ["title", "language"],
    additionalProperties: false,
  };
}
