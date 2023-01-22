import configuration from "../container/configuration";
import { createClient } from "./generated-api-client/createClient";

export const createApiClient = (token?: string) =>
  createClient({
    fetcher: ({ query, variables }, fetch) => {
      const body = JSON.stringify({ query, variables });
      return fetch(
        `http://localhost:${configuration.port || "8000"}/graphql`,
        {
          method: "post",
          body,
          headers: {
            ...(token ? { Authorization: token } : {}),
            "Content-Type": "application/json",
          },
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).then((r: any) => r.json());
    },
  });

export default createApiClient();
