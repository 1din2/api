import { AuthenticationError, ForbiddenError } from "../../base/errors";
import { BaseUseCase, UseCaseEvents, DomainContext } from "../../base/usecase";
import { Validator } from "../../base/validator";
import { Voter } from "../entity/voter";

export interface VoterDomainContext extends DomainContext {
  voter: Voter;
}

export abstract class VoterUseCase<
  TInput,
  TOutput,
  TContext extends VoterDomainContext = VoterDomainContext,
  TEvents extends UseCaseEvents<TInput, TOutput, TContext> = UseCaseEvents<
    TInput,
    TOutput,
    TContext
  >
> extends BaseUseCase<TInput, TOutput, TContext, TEvents> {
  protected constructor(inputValidator?: Validator<TInput>) {
    super(inputValidator);
  }

  private check(voter?: Voter) {
    if (!voter || !voter.id)
      throw new AuthenticationError(`No access to ${this.constructor.name}`);
  }

  protected noAccess(info?: string) {
    throw new ForbiddenError(
      `No access to ${this.constructor.name}.${info ? ` (${info})` : ""}`
    );
  }

  protected override async preExecute(
    input: TInput,
    context: TContext
  ): Promise<TInput> {
    this.check(context.voter);

    return super.preExecute(input, context);
  }
}
