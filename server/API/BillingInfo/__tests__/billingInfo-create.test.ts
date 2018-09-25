import * as request from "supertest";
import { app } from "../../../app";
import {
  createJessicaUserGraphQLRequest,
  createBillingInfoGraphQLRequest
} from "../test-helpers";
import { dropUserCollection } from "../../../AuthServices/testUtils/test-helpers";

const billingInfoInputOne = {
  street_address: "18350 N 32nd st",
  city: "town",
  state: "CO",
  zip_code: "00000",
  country: "mars"
};

describe("Test billing info Create Operations via GraphQL queries and mutations", () => {
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

  test("GraphQL Mutation successfully creates new billing info", async done => {
    expect.assertions(4);

    const response = await createBillingInfoGraphQLRequest(
      createdRequest,
      billingInfoInputOne
    );

    expect((response as any).statusCode).toBe(200);
    const {
      createBillingInfo: { street_address, city, country }
    } = response.body.data;
    expect(street_address).toBe(billingInfoInputOne.street_address);
    expect(city).toBe(billingInfoInputOne.city);
    expect(country).toBe(billingInfoInputOne.country);
    done();
    // This is the shape of req.user in subsequent requests
    // { _id: 5b6e45146d61b33356a69cc2,
    //   email: 'richard@gmail.com',
    //   password: '$2b$10$s28hfqQDTk9MQbTiEXfBoeeOI1SoHDFpw7YvJoZhyWdZnoQ7Im4C.',
    //   __v: 0,
    //   billing_info: { street_address: '18350 N 32nd st',
    //   city: 'town',
    //  country: 'mars' } }
  });
});
