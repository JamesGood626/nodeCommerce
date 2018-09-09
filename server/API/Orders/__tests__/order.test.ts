import * as request from "supertest";
import { app } from "../../../app";
import { createUser } from "../../../Services/auth";
import { Product } from "../../products/Models/product";
import { dropUserCollection } from "../../../Services/testUtils/test-helpers";
import { dropProductCollection } from "../../Products/__tests__/product.test";
import {
  createProductGraphQLRequest,
  createCartGraphQLRequest,
  editCartGraphQLRequest,
  IProductCreated
} from "../../Cart/__tests__/cart.test";
// Create an order
// *****
// Use the shipping address provided by user if they entered one.
// or just use the billing address on file,
// otherwise if they don't have a billing address entered
// don't allow them to post from the client side.
// *****
// Retrieve All orders
// Retrieve Details of a single order ()
// Edit an order
// Delete an order (Admin only)
const adminUserCreateConfig = {
  email: "admin@gmail.com",
  password: "password",
  is_admin: true
};

const createBillingInfoConfig = {
  street_address: "18350 N 32nd st",
  city: "town",
  state: "CO",
  zip_code: "00000",
  country: "mars"
};

const createAndLoginUser = async (createdRequest, userCreateConfig) => {
  await createUser(userCreateConfig);
  const loginPostData = {
    query: `mutation loginUserOp($email: String!, $password: String!) {
                loginUser(email: $email, password: $password) {
                  email
                }
              }`,
    operationName: "loginUserOp",
    variables: {
      email: "admin@gmail.com",
      password: "password"
    }
  };
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(loginPostData);

  const { loginUser } = response.body.data;
};

const createOrderWithUsersBillingInfoGraphQLRequest = async createdRequest => {
  const postData = {
    query: `mutation createOrderWithUsersBillingInfoOp {
                createOrderWithUsersBillingInfo {
                  total_amount
                  after_tax_amount
                  shipping_address {
                    city
                    state
                    country
                    state
                    street_address
                    zip_code
                  }
                  products {
                    _id
                  }
                  quantity
                }
              }`,
    operationName: "createOrderWithUsersBillingInfoOp"
  };
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);

  const { createOrderWithUsersBillingInfo } = response.body.data;
  console.log("THE CREATE ORDER RESPONSE BODY: ", response.body);
  return createOrderWithUsersBillingInfo;
};

const createUserBillingInfo = async (createdRequest, config) => {
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
      input: config
    }
  };

  const createBillingInfoResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(createBillingInfoPostData);
};

describe.only("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;
  const productIdArr: IProductCreated[] = [];

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    await dropUserCollection();
    await createAndLoginUser(createdRequest, adminUserCreateConfig);
    await dropProductCollection();
    const productOne = await createProductGraphQLRequest(createdRequest, 9.99, [
      "mercury",
      "venus"
    ]);
    const productTwo = await createProductGraphQLRequest(
      createdRequest,
      14.99,
      ["earth", "mars"]
    );
    const productThree = await createProductGraphQLRequest(
      createdRequest,
      19.99,
      ["jupiter", "saturn"]
    );
    productIdArr.push(productOne);
    productIdArr.push(productTwo);
    productIdArr.push(productThree);
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully creates new orders", async () => {
    await createUserBillingInfo(createdRequest, createBillingInfoConfig);
    await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice,
      quantity: 2
    });
    await editCartGraphQLRequest(createdRequest, {
      productId: productIdArr[1].productId,
      price: productIdArr[1].productPrice,
      quantity: 4
    });
    const productPriceOne = productIdArr[0].productPrice * 2;
    const productPriceTwo = productIdArr[1].productPrice * 4;
    const total = productPriceOne + productPriceTwo;
    const taxAmount = total + total * 0.14;
    const result = await createOrderWithUsersBillingInfoGraphQLRequest(
      createdRequest
    );
    // ALSO NEED TO TEST THAT CART IS DELETED FROM USER DURING THE OPERATION.
    expect(parseFloat(result.total_amount)).toBe(total);
    expect(result.after_tax_amount).toEqual(taxAmount.toFixed(2));
    expect(result.products[0]._id).toBe(productIdArr[0].productId);
    expect(result.products[1]._id).toBe(productIdArr[1].productId);
    expect(result.quantity).toEqual({
      [productIdArr[0].productId]: 2,
      [productIdArr[1].productId]: 4
    });
    expect(result.shipping_address).toEqual(createBillingInfoConfig);
  });
});
