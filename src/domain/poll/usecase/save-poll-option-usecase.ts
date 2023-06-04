import { pick } from "ramda";
import { RequiredJSONSchema } from "../../base/json-schema";
import { UserRole } from "../../user/entity/user";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import { Tag } from "../entity/tag";
import { SavePollTagsUseCase } from "./save-poll-tags-usecase";
import { PollOption, PollOptionData } from "../entity/poll-option";
import { PollOptionService } from "../service/poll-option-service";
import { InvalidInputError } from "../../base/errors";
import { isNumber } from "../../base/util";

export type SavePollOptionInput = Partial<
  Pick<
    PollOptionData,
    "title" | "pollId" | "imageId" | "description" | "color" | "id" | "priority"
  >
> & { tags?: string[] };

export class SavePollOptionUseCase extends AuthUseCase<
  SavePollOptionInput,
  PollOption
> {
  constructor(
    private pollOptionService: PollOptionService,
    private saveTags: SavePollTagsUseCase
  ) {
    super(UserRole.ADMIN);
  }

  private create({
    pollId,
    color,
    description,
    imageId,
    priority,
    title,
  }: SavePollOptionInput): Promise<PollOption> {
    const id = PollOption.createId();
    if (!pollId) throw new InvalidInputError("pollId is required");
    if (!title) throw new InvalidInputError("title is required");
    if (!isNumber(priority))
      throw new InvalidInputError("priority is required");

    return this.pollOptionService.create({
      id,
      pollId,
      color,
      description,
      imageId,
      priority,
      title,
    });
  }

  private async update({
    id,
    pollId,
    color,
    description,
    imageId,
    priority,
    title,
  }: SavePollOptionInput): Promise<PollOption> {
    if (!id) throw new InvalidInputError("id is required");
    if (pollId) throw new InvalidInputError("pollId can't be updated");
    if (!title) throw new InvalidInputError("title is required");
    if (color === null) throw new InvalidInputError("color is required");
    if (!isNumber(priority))
      throw new InvalidInputError("priority is required");
    if (imageId === null) throw new InvalidInputError("imageId is required");

    return this.pollOptionService.update({
      id,
      color,
      description,
      imageId,
      priority,
      title,
    });
  }

  protected override async innerExecute(
    input: SavePollOptionInput,
    context: AuthDomainContext
  ): Promise<PollOption> {
    const option = input.id
      ? await this.update(input)
      : await this.create(input);

    if (input.tags)
      await this.saveTags.execute(
        {
          pollId: option.pollId,
          data: [
            {
              pollOptionId: option.id,
              tags: input.tags.map((name) => ({ name })),
            },
          ],
        },
        context
      );

    return option;
  }

  public static override jsonSchema: RequiredJSONSchema = {
    type: "object",
    properties: {
      ...pick(
        [
          "id",
          "title",
          "pollId",
          "imageId",
          "description",
          "color",
          "id",
          "priority",
        ],
        PollOption.jsonSchema.properties
      ),
      tags: {
        type: "array",
        items: Tag.jsonSchema.properties.name,
        uniqueItems: true,
        minItems: 0,
        maxItems: 5,
      },
    },
    required: [],
    additionalProperties: false,
  };
}
