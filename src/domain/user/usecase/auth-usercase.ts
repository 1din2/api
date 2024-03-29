import { BaseUseCase, UseCaseEvents } from "../../base/usecase";
import { Validator } from "../../base/validator";
import { AuthenticationError, ForbiddenError } from "../../base/errors";
import { User, UserRole } from "../entity/user";
import { VoterDomainContext } from "./voter-usercase";

export interface AuthDomainContext extends VoterDomainContext {
  currentUser: User;
}

export abstract class AuthUseCase<
  TInput,
  TOutput,
  TContext extends AuthDomainContext = AuthDomainContext,
  TEvents extends UseCaseEvents<TInput, TOutput, TContext> = UseCaseEvents<
    TInput,
    TOutput,
    TContext
  >
> extends BaseUseCase<TInput, TOutput, TContext, TEvents> {
  protected constructor(
    protected readonly userRole: UserRole = UserRole.USER,
    inputValidator?: Validator<TInput>
  ) {
    super(inputValidator);
  }

  private checkCurrentUser(currentUser?: User) {
    if (!currentUser || !currentUser.id)
      throw new AuthenticationError(`No access to ${this.constructor.name}`);
    if (
      currentUser.role !== this.userRole &&
      currentUser.role !== UserRole.ADMIN
    )
      this.noAccess();
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
    this.checkCurrentUser(context.currentUser);

    return super.preExecute(input, context);
  }
}
