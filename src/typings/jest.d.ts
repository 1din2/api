/* eslint-disable @typescript-eslint/no-explicit-any */
// import { JSONSchema } from "../domain/base/json-schema";

declare global {
  namespace jest {
    interface Matchers<R> {
      // toMatchSchema(schema: JSONSchema): R;
      toThrowGraphQLErrors(errors: any): R;
      toThrowGraphQLCode(code: string): R;
      toThrowCode(code: string): R;
      toThrowErrorCode(error: any, code: string): R;
    }
  }
}
