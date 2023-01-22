import { BaseUseCase, UseCaseEvents, DomainContext } from "../../base/usecase";
import { Validator } from "../../base/validator";
import { AuthenticationError, ForbiddenError } from "../../base/errors";
import { UserData, UserRole } from "../entity/user";

export interface AuthDomainContext extends DomainContext {
  currentUser: UserData;
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

  private checkCurrentUser(currentUser?: UserData) {
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
