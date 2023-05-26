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

export type CreatePollInput = Pick<
  PollData,
  | "title"
  | "description"
  | "imageId"
  | "language"
  | "maxSelect"
  | "minSelect"
  | "type"
> &
  Partial<Pick<PollData, "slug" | "endsAt">> & { tags?: string[] };

export class CreatePollUseCase extends AuthUseCase<CreatePollInput, Poll> {
  constructor(
    private pollService: PollService,
    private saveTags: SavePollTagsUseCase
  ) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(
    input: CreatePollInput,
    context: AuthDomainContext
  ): Promise<Poll> {
    const { currentUser, project } = context;
    if (!project) throw new InvalidInputError("Invalid project");

    const slug = slugify(input.slug || input.title);
    const endsAt = input.endsAt || dateAddDays(90).getTime();
    const type = input.type || PollType.SELECT;

    const createData: PollCreateData = {
      ...input,
      slug,
      endsAt,
      project,
      userId: currentUser.id,
      type,
      id: Poll.createId(),
      status: PollStatus.DRAFT,
    };

    const poll = await this.pollService.create(createData);

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
    required: ["title", "language", "type", "maxSelect", "minSelect"],
    additionalProperties: false,
  };
}
