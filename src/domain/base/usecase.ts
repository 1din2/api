import { Emitter, IEmitter } from "./events";
import { Validator, JsonValidator } from "./validator";
import { RequiredJSONSchema, JSONSchema } from "./json-schema";
import { BaseErrorCode } from "./errors";
import logger from "../logger";
import { Logger } from "./logger";

export interface UseCaseEvents<
  TInput,
  TOutput,
  TContext extends DomainContext = DomainContext
> {
  executed: { input: TInput; output: TOutput; context: TContext };
  executing: { input: TInput; context: TContext };
}

export interface DomainContext {
  language: string;
  logger: Logger;
  isAuthenticated: boolean;
  project: string;
}

export interface UseCase<
  TInput,
  TOutput,
  TContext extends DomainContext = DomainContext,
  TEvents extends UseCaseEvents<TInput, TOutput, TContext> = UseCaseEvents<
    TInput,
    TOutput,
    TContext
  >
> extends IEmitter<TEvents> {
  execute(input: TInput, context: TContext): Promise<TOutput>;
}

export interface StaticUseCase {
  readonly jsonSchema: RequiredJSONSchema | undefined;
}

/**
 * Base UseCase class. All UseCases should extend this one.
 */
export abstract class BaseUseCase<
    TInput,
    TOutput,
    TContext extends DomainContext = DomainContext,
    TEvents extends UseCaseEvents<TInput, TOutput, TContext> = UseCaseEvents<
      TInput,
      TOutput,
      TContext
    >
  >
  extends Emitter<TEvents>
  implements UseCase<TInput, TOutput, TContext, TEvents>
{
  protected inputValidators: Validator<TInput>[] = [];

  public constructor(inputValidator?: Validator<TInput>) {
    super();
    this.setInputValidator(inputValidator);
  }

  /**
   * Uses inputValidator or creates a new one using 'jsonSchema'.
   * @param inputValidator Input data validator
   */
  private setInputValidator(inputValidator?: Validator<TInput>) {
    const schema = (this.constructor as unknown as StaticUseCase).jsonSchema;
    if (schema)
      inputValidator = new JsonValidator(
        schema,
        {},
        BaseErrorCode.INVALID_INPUT
      );

    if (inputValidator) this.inputValidators.push(inputValidator);
  }

  /**
   * Pre execute operations: validation, etc.
   */
  protected async preExecute(
    input: TInput,
    _context: TContext
  ): Promise<TInput> {
    let output = input;
    for (const validator of this.inputValidators) {
      output = await validator.validate(output);
    }
    return output;
  }

  public async execute(input: TInput, context: TContext) {
    const validatedInput = await this.preExecute(input, context);

    await this.onExecuting(input, context);

    const output = await this.innerExecute(validatedInput, context);

    await this.onExecuted(input, output, context);

    return output;
  }

  protected abstract innerExecute(
    input: TInput,
    context: TContext
  ): Promise<TOutput>;

  /**
   * Fire executed event.
   * @param output Created output
   */
  protected async onExecuted(
    input: TInput,
    output: TOutput,
    context: TContext
  ) {
    logger.debug(`${this.constructor.name} executed.`);
    return this.emit("executed", { input, output, context });
  }

  /**
   * Fire executing event.
   */
  protected async onExecuting(input: TInput, context: TContext) {
    return this.emit("executing", { input, context });
  }

  /**
   * Json Schema for validating input data
   */
  public static readonly jsonSchema:
    | RequiredJSONSchema
    | JSONSchema
    | undefined = undefined;
}
