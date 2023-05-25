import { pick } from "ramda";
import { InvalidInputError } from "../../base/errors";
import { RequiredJSONSchema } from "../../base/json-schema";
import { dateAddDays, slugify } from "../../base/util";
import { User, UserRole } from "../../user/entity/user";
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
  Partial<Pick<PollData, "slug" | "endsAt">>;

export class CreatePollUseCase extends AuthUseCase<CreatePollInput, Poll> {
  constructor(private pollService: PollService) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(
    input: CreatePollInput,
    { currentUser, project }: AuthDomainContext
  ): Promise<Poll> {
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

    return this.pollService.create(createData);
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
        ],
        User.jsonSchema.properties
      ),
      slug: { oneOf: [Poll.jsonSchema.properties.slug, { type: "null" }] },
      endsAt: { oneOf: [Poll.jsonSchema.properties.endsAt, { type: "null" }] },
    },
    required: ["title", "language", "type", "maxSelect", "minSelect"],
    additionalProperties: false,
  };
}
