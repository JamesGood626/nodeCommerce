import * as request from "supertest";
import { app } from "../../../app";
import { Product } from "../Models/product";
import { createUser } from "../../../Services/auth";
// import { initMongoMongooseConnection } from '../../Middleware';
import { dropUserCollection } from "../../../Services/tests/test-helpers";
// import { User } from "../../API/Accounts/Models/user";

const dropProductCollection = async () => {
  await Product.remove({}, err =>
    console.log("Product Collection Drop Error: ", err)
  );
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    // await dropUserCollection();
    await dropProductCollection();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully creates new product.", async done => {
    // expect.assertions(4);
    const mutationInput = {
      product_title: "Planet",
      description: "The most awesome product description.",
      price: 9.99,
      sale_price_start: new Date("2016-01-01T13:10:20Z"),
      images: [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune"
      ]
    };
    const postData = {
      query: `mutation createProductOp($input: ProductInput) {
                    createProduct(input: $input) {
                      product_title
                      description
                      price
                      sale_price_start
                      images
                    }
                  }`,
      operationName: "createProductOp",
      variables: {
        input: mutationInput
      }
    };

    // // sale_price_start: "2016-01-01T13:10:20Z",

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const {
      createProduct: {
        product_title,
        description,
        price,
        sale_price_start,
        images
      }
    } = response.body.data;
    console.log("The product create response: ", response.body.data);
    // Front end will always need to use new Date on the response from graphql
    // console.log("THE SALE_PRICE_START: ", new Date(sale_price_start));
    expect((response as any).statusCode).toBe(200);
    expect(product_title).toBe(mutationInput.product_title);
    expect(description).toBe(mutationInput.description);
    expect(price).toBe(mutationInput.price);
    expect(images).toEqual(mutationInput.images);
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
