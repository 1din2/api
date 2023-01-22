/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from "ajv";
import * as R from "ramda";
import { printExpected, printReceived, matcherHint } from "jest-matcher-utils";
import { DomainError } from "../../domain/base/errors";

const ajv = new Ajv();

const toThrowCode = (input: any, code: string): jest.CustomMatcherResult => {
  if (typeof input === "function") {
    try {
      input();
    } catch (error) {
      // eslint-disable-next-line no-param-reassign
      input = error;
    }
  }
  const errorCode = input.code || input.errorCode || input.exception.errorCode;
  if (errorCode !== code)
    return {
      message: () =>
        [
          matcherHint("toThrowCode", undefined, undefined, {}),
          "\n\n",
          `Expected: ${code}\n`,
          `Received: ${printReceived(JSON.stringify(input))}\n\n`,
        ].join(""),
      pass: false,
    };

  return {
    message: () => "expected to match error code",
    pass: true,
  };
};

expect.extend({
  toMatchSchema(data: any, schema: any): jest.CustomMatcherResult {
    const pass = ajv.validate(schema, data);
    if (pass) {
      return {
        message: () => "expected to not match schema",
        pass: true,
      };
    }
    return {
      message: () => {
        const errors = JSON.stringify(ajv.errors, null, 2);
        return `expected to match schema, instead ${errors}`;
      },
      pass: false,
    };
  },
  toThrowGraphQLErrors(data: any, errors: any): jest.CustomMatcherResult {
    const matcherName = "toThrowGraphQLErrors";
    const options = { isNot: this.isNot };
    const picks = ["message"];
    if (!data || !data.errors) {
      return {
        message: () => `expected data to have key "errors"`,
        pass: false,
      };
    }
    const expected = R.apply(R.pick(picks), errors);
    const received = R.apply(R.pick(picks), data.errors);
    if (!R.equals(expected, received)) {
      return {
        message: () =>
          [
            matcherHint(matcherName, undefined, undefined, options),
            "\n\n",
            `Expected: ${printExpected(expected)}\n`,
            `Received: ${printReceived(received)}\n\n`,
          ].join(""),
        pass: false,
      };
    }
    return {
      message: () =>
        [
          matcherHint(matcherName, undefined, undefined, options),
          "\n\n",
          `Expected: not ${printExpected(expected)}\n`,
        ].join(""),
      pass: true,
    };
  },
  toThrowErrorCode(
    error: any,
    instance: { new (...args: any[]): DomainError },
    code: string
  ): jest.CustomMatcherResult {
    if (!(error instanceof instance))
      return {
        message: () =>
          [
            matcherHint("toThrowErrorCode", undefined, undefined, {}),
            "\n\n",
            `Expected: DomainError\n`,
            `Received: ${printReceived(error)}\n\n`,
          ].join(""),
        pass: false,
      };
    if (error.errorCode !== code)
      return {
        message: () => `expected "errorCode" to be "${code}"`,
        pass: false,
      };

    return {
      message: () => "expected to not match error type and code",
      pass: true,
    };
  },
  toThrowGraphQLCode(data: any, code: string): jest.CustomMatcherResult {
    if (!data || !data.errors) {
      return {
        message: () => `expected data to have key "errors"`,
        pass: false,
      };
    }
    return toThrowCode(data.errors[0].extensions, code);
  },
  toThrowCode,
});
