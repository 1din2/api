import { ApiContext } from "../container/api-context";

declare global {
  namespace Express {
    interface Request {
      apiContext: ApiContext;
    }
  }
}
