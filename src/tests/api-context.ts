import { createApiContext } from "../container/api-context";
import { Request } from "express";

export function createTestApiContext(input?: Request) {
  return createApiContext(input as never);
}
