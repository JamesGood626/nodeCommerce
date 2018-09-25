import * as request from "supertest";
import { app } from "../../../app";
import {
  createJessicaUserGraphQLRequest,
  createBillingInfoGraphQLRequest,
  deleteBillingInfoGraphQLRequest
} from "../test-helpers";
import { dropUserCollection } from "../../../AuthServices/testUtils/test-helpers";

const billingInfoInput = {
  street_address: "18350 N 32nd st",
  city: "town",
  state: "CO",
  zip_code: "00000",
  country: "mars"
};

describe("Test billing info CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    await dropUserCollection();
    await createJessicaUserGraphQLRequest(createdRequest);

    afterAll(async done => {
      await server.close(done);
    });
  });

  test("GraphQL Mutation successfully deletes billing info", async done => {
    expect.assertions(6);

    const createResponse = await createBillingInfoGraphQLRequest(
      createdRequest,
      billingInfoInput
    );

    expect((createResponse as any).statusCode).toBe(200);
    const { createBillingInfo } = createResponse.body.data;
    expect(createBillingInfo.street_address).toBe("18350 N 32nd st");
    expect(createBillingInfo.city).toBe("town");
    expect(createBillingInfo.country).toBe("mars");

    const deleteResponse = await deleteBillingInfoGraphQLRequest(
      createdRequest
    );

    expect((deleteResponse as any).statusCode).toBe(200);
    expect(deleteResponse.body.data.deleteBillingInfo.billing_info).toBe(null);
    done();
  });
});
