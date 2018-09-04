import * as request from "supertest";
import { app } from "../../../app";
import { createUser } from "../../../Services/auth";
import { dropUserCollection } from "../../../Services/tests/test-helpers";

describe("Test billing info CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    await dropUserCollection();
    await createUser({ email: "jessica@gmail.com", password: "password" });
    const postData = {
      query: `mutation loginUserOp($email: String!, $password: String!) {
                  loginUser(email: $email, password: $password) {
                    email
                  }
                }`,
      operationName: "loginUserOp",
      variables: {
        email: "jessica@gmail.com",
        password: "password"
      }
    };
    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully creates new billing info.", async done => {
    expect.assertions(4);

    const postData = {
      query: `mutation createBillingInfoOp($input: BillingInfoInput) {
                    createBillingInfo(input: $input) {
                      street_address
                      city
                      country
                    }
                  }`,
      operationName: "createBillingInfoOp",
      variables: {
        input: {
          street_address: "18350 N 32nd st",
          city: "town",
          state: "CO",
          zip_code: "00000",
          country: "mars"
        }
      }
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    expect((response as any).statusCode).toBe(200);
    const {
      createBillingInfo: { street_address, city, country }
    } = response.body.data;
    expect(street_address).toBe("18350 N 32nd st");
    expect(city).toBe("town");
    expect(country).toBe("mars");
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

  test("GraphQL Mutation successfully edits new billing info.", async done => {
    expect.assertions(8);
    const createBillingInfoPostData = {
      query: `mutation createBillingInfoOp($input: BillingInfoInput) {
                    createBillingInfo(input: $input) {
                      street_address
                      city
                      country
                    }
                  }`,
      operationName: "createBillingInfoOp",
      variables: {
        input: {
          street_address: "18350 N 32nd st",
          city: "town",
          state: "CO",
          zip_code: "00000",
          country: "mars"
        }
      }
    };

    const createBillingInfoResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(createBillingInfoPostData);

    expect((createBillingInfoResponse as any).statusCode).toBe(200);
    const { createBillingInfo } = createBillingInfoResponse.body.data;
    expect(createBillingInfo.street_address).toBe("18350 N 32nd st");
    expect(createBillingInfo.city).toBe("town");
    expect(createBillingInfo.country).toBe("mars");

    const editBillingInfoPostData = {
      query: `mutation editBillingInfoOp($input: BillingInfoInput) {
                    editBillingInfo(input: $input) {
                      street_address
                      city
                      country
                    }
                  }`,
      operationName: "editBillingInfoOp",
      variables: {
        input: {
          street_address: "2971 75th ave",
          city: "wootville",
          state: "CA",
          zip_code: "99999",
          country: "pluto"
        }
      }
    };

    const editBillingInfoResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(editBillingInfoPostData);

    expect((editBillingInfoResponse as any).statusCode).toBe(200);
    const { editBillingInfo } = editBillingInfoResponse.body.data;
    expect(editBillingInfo.street_address).toBe("2971 75th ave");
    expect(editBillingInfo.city).toBe("wootville");
    expect(editBillingInfo.country).toBe("pluto");
    done();
  });

  test("GraphQL Mutation successfully deletes billing info.", async done => {
    expect.assertions(6);

    const createBillingInfoPostData = {
      query: `mutation createBillingInfoOp($input: BillingInfoInput) {
                    createBillingInfo(input: $input) {
                      street_address
                      city
                      country
                    }
                  }`,
      operationName: "createBillingInfoOp",
      variables: {
        input: {
          street_address: "18350 N 32nd st",
          city: "town",
          state: "CO",
          zip_code: "00000",
          country: "mars"
        }
      }
    };

    const createBillingInfoResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(createBillingInfoPostData);

    expect((createBillingInfoResponse as any).statusCode).toBe(200);
    const { createBillingInfo } = createBillingInfoResponse.body.data;
    expect(createBillingInfo.street_address).toBe("18350 N 32nd st");
    expect(createBillingInfo.city).toBe("town");
    expect(createBillingInfo.country).toBe("mars");

    const deleteBillingInfoPostData = {
      query: `mutation deleteBillingInfoOp {
                    deleteBillingInfo {
                      billing_info {
                        street_address
                      }
                    }
                  }`,
      operationName: "deleteBillingInfoOp"
    };

    const deleteBillingInfoResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(deleteBillingInfoPostData);

    expect((deleteBillingInfoResponse as any).statusCode).toBe(200);
    expect(
      deleteBillingInfoResponse.body.data.deleteBillingInfo.billing_info
    ).toBe(null);
    done();
  });
});

// query: '{ allUsers { id, email } }'
// const postData = {
//   mutation: `loginUser($email: String!, $password: String!) {
//                 loginUser(email: $email, password: $password) {
//                   email
//                 }
//               }`,
//   operationName: 'loginUser',
//   variables: {
//     email: 'richard@gmail.com',
//     password: 'password'
//   }
// };
