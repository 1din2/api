import { InvalidInputError } from "../../base/errors";
import { UserRole } from "../../user/entity/user";
import { AuthUseCase } from "../../user/usecase/auth-usercase";
import { Poll, PollStatus } from "../entity/poll";
import { PollOptionService } from "../service/poll-option-service";
import { PollService } from "../service/poll-service";

export interface SetPollStatusInput {
  id: string;
  status: PollStatus;
}

export class SetPollStatusUseCase extends AuthUseCase<
  SetPollStatusInput,
  Poll
> {
  constructor(
    private pollService: PollService,
    private pollOptionService: PollOptionService
  ) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute({
    status,
    id,
  }: SetPollStatusInput): Promise<Poll> {
    const poll = await this.pollService.checkById(id);

    if (status === PollStatus.ACTIVE) {
      if (poll.status === PollStatus.ENDED)
        throw new InvalidInputError(`Poll has already ended`);
      // if (!poll.imageId) throw new InvalidInputError(`Poll must have an image`);
      const options = await this.pollOptionService.findByPollId(id);
      if (options.length < poll.minSelect || options.length === 0)
        throw new InvalidInputError(
          `Poll must have at least ${poll.minSelect} options`
        );
    }

    return this.pollService.update({ id, status });
  }
}
