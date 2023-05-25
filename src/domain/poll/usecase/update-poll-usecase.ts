import { pick } from "ramda";
import { RequiredJSONSchema } from "../../base/json-schema";
import { slugify } from "../../base/util";
import { UserRole } from "../../user/entity/user";
import { AuthUseCase } from "../../user/usecase/auth-usercase";
import { Poll, PollData, PollUpdateData } from "../entity/poll";
import { PollService } from "../service/poll-service";
import { EntityId } from "../../base/entity";

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
> & { id: EntityId };

export class UpdatePollUseCase extends AuthUseCase<UpdatePollInput, Poll> {
  constructor(private pollService: PollService) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute(input: UpdatePollInput): Promise<Poll> {
    const updateData: PollUpdateData = {
      ...input,
    };

    if (updateData.slug) updateData.slug = slugify(updateData.slug);

    return this.pollService.update(updateData);
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
    },
    required: ["id"],
    additionalProperties: false,
  };
}
