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
import { UploadImageUseCase } from "../../image/usecase/upload-image-usecase";
import { EntityId } from "../../base/entity";
import { WebImageService } from "../../image/service/web-image-service";
import axios from "axios";
import { parse as getContentType } from "content-type";

export type SavePollOptionInput = Partial<
  Pick<
    PollOptionData,
    "title" | "pollId" | "imageId" | "description" | "color" | "id" | "priority"
  >
> & { tags?: string[]; webImageId?: EntityId; imageUrl?: string };

export class SavePollOptionUseCase extends AuthUseCase<
  SavePollOptionInput,
  PollOption
> {
  constructor(
    private pollOptionService: PollOptionService,
    private webImageService: WebImageService,
    private saveTags: SavePollTagsUseCase,
    private uploadImage: UploadImageUseCase
  ) {
    super(UserRole.ADMIN);
  }

  private async getImageId(
    { imageId, imageUrl, webImageId }: SavePollOptionInput,
    context: AuthDomainContext
  ): Promise<EntityId | undefined | null> {
    if (imageId !== undefined) return imageId;

    if (webImageId) {
      const webImage = await this.webImageService.checkById(webImageId);
      imageUrl = webImage.url;
    }

    if (imageUrl) {
      const response = await axios({
        url: imageUrl,
        timeout: 1000 * 10,
        maxRedirects: 1,
        maxContentLength: 20e6,
        responseType: "stream",
        headers: {
          Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      const filename = new URL(imageUrl).pathname.split("/").pop() || "image";
      const mimetype =
        getContentType(response.headers["content-type"])?.type || "image/jpeg";
      const image = await this.uploadImage.execute(
        {
          stream: response.data,
          encoding: "binary",
          filename,
          mimetype,
        },
        context
      );
      return image.id;
    }

    return undefined;
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
    if (title === null) throw new InvalidInputError("title is required");
    if (color === null) throw new InvalidInputError("color is required");
    if (priority === null) throw new InvalidInputError("priority is required");
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
    input.imageId = await this.getImageId(input, context);
    if (input.imageId === undefined) delete input.imageId;
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
      imageUrl: { type: "string", format: "uri" },
      webImageId: { type: "string" },
    },
    required: [],
    additionalProperties: false,
  };
}
