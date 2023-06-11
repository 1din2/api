import { InvalidInputError } from "../../base/errors";
import { UserRole } from "../../user/entity/user";
import { AuthUseCase } from "../../user/usecase/auth-usercase";
import { Poll, PollStatus } from "../entity/poll";
import { PollService } from "../service/poll-service";

export interface DeletePollInput {
  id: string;
}

export class DeletePollUseCase extends AuthUseCase<DeletePollInput, Poll> {
  constructor(private pollService: PollService) {
    super(UserRole.ADMIN);
  }

  protected override async innerExecute({
    id,
  }: DeletePollInput): Promise<Poll> {
    const poll = await this.pollService.checkById(id);

    if ([PollStatus.ACTIVE, PollStatus.ENDED].includes(poll.status)) {
      throw new InvalidInputError(`Poll must be in draft to be deleted`);
    }

    await this.pollService.deleteById(id);
    return poll;
  }
}
