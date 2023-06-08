import { uniq } from "../../base/util";
import { WebImage, WebImageCreateData } from "../../image/entity/web-image";
import { WebImageService } from "../../image/service/web-image-service";
import logger from "../../logger";
import { UserRole } from "../../user/entity/user";
import {
  AuthDomainContext,
  AuthUseCase,
} from "../../user/usecase/auth-usercase";
import { Poll } from "../entity/poll";
import { PollService } from "../service/poll-service";
import { CreatePollUseCase } from "./create-poll-usecase";
import { SavePollOptionUseCase } from "./save-poll-option-usecase";

export interface GeneratePollInput {
  language: string;
  info?: string;
}

export class GeneratePollUseCase extends AuthUseCase<GeneratePollInput, Poll> {
  constructor(
    private createPoll: CreatePollUseCase,
    private saveOption: SavePollOptionUseCase,
    private pollService: PollService,
    private webImageService: WebImageService
  ) {
    super(UserRole.ADMIN);
  }

  private async createWebImages(data: {
    text: string;
    pollId: string;
    pollOptionId: string;
  }) {
    const images = await this.webImageService.webSearch({
      query: data.text,
      limit: 4,
      minHeight: 500,
      minWidth: 500,
    });

    if (!images.length) logger.warn(`No images found for ${data.text}`);

    await this.webImageService.createMany(
      images.map<WebImageCreateData>((image) => ({
        id: WebImage.createId(),
        url: image.url,
        width: image.width,
        height: image.height,
        hostname: image.hostname,
        urlHash: WebImage.createHash(image.url),
        pollId: data.pollId,
        pollOptionId: data.pollOptionId,
        query: data.text,
      }))
    );
  }

  protected override async innerExecute(
    input: GeneratePollInput,
    context: AuthDomainContext
  ): Promise<Poll> {
    const data = await this.pollService.generatePoll(input);
    const tags = uniq(data.tags || [])
      // .concat(data.options.map((option) => option.tags || []).flat())
      .slice(0, 5);

    const poll = await this.createPoll.execute(
      {
        language: input.language,
        title: data.title,
        description: data.description || null,
        tags,
      },
      context
    );

    let priority = 0;
    for (const op of data.options) {
      const option = await this.saveOption.execute(
        {
          pollId: poll.id,
          title: op.title,
          tags: (op.tags || []).slice(0, 2),
          description: op.description || null,
          priority: priority++,
        },
        context
      );
      await this.createWebImages({
        text:
          option.title.length > 10
            ? option.title
            : option.description || option.title,
        pollId: poll.id,
        pollOptionId: option.id,
      });
    }

    return poll;
  }
}
