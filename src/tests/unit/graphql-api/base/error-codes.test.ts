import { AllErrorCodes } from "../../../../graphql-api/base/types/types";
import apiClient from "../../../api-client";

describe("ErrorCodes", () => {
  test("default", async () => {
    const data = await apiClient.chain.query.errorCodes.execute();

    const values = Object.values(AllErrorCodes);

    expect(data).toHaveLength(values.length);
    expect(data).toEqual(values);
  });
});
