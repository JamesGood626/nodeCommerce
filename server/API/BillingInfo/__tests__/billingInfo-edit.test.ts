import * as request from "supertest";
import { app } from "../../../app";
import {
  createJessicaUserGraphQLRequest,
  createBillingInfoGraphQLRequest,
  editBillingInfoGraphQLRequest
} from "../test-helpers";
import { dropUserCollection } from "../../../AuthServices/testUtils/test-helpers";

const billingInfoInputOne = {
  street_address: "18350 N 32nd st",
  city: "town",
  state: "CO",
  zip_code: "00000",
  country: "mars"
};

const billingInfoInputTwo = {
  street_address: "2971 75th ave",
  city: "wootville",
  state: "CA",
  zip_code: "99999",
  country: "pluto"
};

describe("Test billing info Edit Operations via GraphQL queries and mutations", () => {
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

  test("GraphQL Mutation successfully edits new billing info", async done => {
    expect.assertions(8);

    const createResponse = await createBillingInfoGraphQLRequest(
      createdRequest,
      billingInfoInputOne
    );

    expect((createResponse as any).statusCode).toBe(200);
    const { createBillingInfo } = createResponse.body.data;
    expect(createBillingInfo.street_address).toBe(
      billingInfoInputOne.street_address
    );
    expect(createBillingInfo.city).toBe(billingInfoInputOne.city);
    expect(createBillingInfo.country).toBe(billingInfoInputOne.country);

    const editResponse = await editBillingInfoGraphQLRequest(
      createdRequest,
      billingInfoInputTwo
    );

    expect((editResponse as any).statusCode).toBe(200);
    const { editBillingInfo } = editResponse.body.data;
    expect(editBillingInfo.street_address).toBe(
      billingInfoInputTwo.street_address
    );
    expect(editBillingInfo.city).toBe(billingInfoInputTwo.city);
    expect(editBillingInfo.country).toBe(billingInfoInputTwo.country);
    done();
  });
});
