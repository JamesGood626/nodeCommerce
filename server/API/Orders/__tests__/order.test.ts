import * as request from "supertest";
import { app } from "../../../app";
import { createUser } from "../../../Services/auth";
import { User } from "../../Accounts/Models/user";
import { Order } from "../Models/order";
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

const regularUserCreateConfig = {
  email: "jessica@gmail.com",
  password: "password",
  is_admin: false
};

const shippingAddressInput = {
  city: "Seattle",
  state: "WA",
  country: "USA",
  street_address: "I forgot",
  zip_code: "29391"
};

const shippingAddressInputTwo = {
  city: "Phoenix",
  state: "AZ",
  country: "USA",
  street_address: "I forgot twice now",
  zip_code: "93019"
};

const createBillingInfoConfig = {
  street_address: "18350 N 32nd st",
  city: "town",
  state: "CO",
  zip_code: "00000",
  country: "mars"
};

const dropOrderCollection = async () => {
  await Order.remove({}, err =>
    console.log("Order Collection Drop Error: ", err)
  );
};

const loginUser = async (createdRequest, userConfig) => {
  const loginPostData = {
    query: `mutation loginUserOp($email: String!, $password: String!) {
                loginUser(email: $email, password: $password) {
                  email
                }
              }`,
    operationName: "loginUserOp",
    variables: {
      email: userConfig.email,
      password: userConfig.password
    }
  };
  await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(loginPostData);
};

const createOrderWithUsersBillingGraphQLRequest = async createdRequest => {
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
  return createOrderWithUsersBillingInfo;
};

const createOrderWithShippingAddressGraphQLRequest = async (
  createdRequest,
  shippingAddressInput
) => {
  const postData = {
    query: `mutation createOrderWithShippingAddressOp($input: AddressInput) {
                createOrderWithShippingAddress(input: $input) {
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
    operationName: "createOrderWithShippingAddressOp",
    variables: {
      input: shippingAddressInput
    }
  };
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);

  const { createOrderWithShippingAddress } = response.body.data;
  return createOrderWithShippingAddress;
};

// ********
const retrieveAllOrdersGraphQLRequest = async createdRequest => {
  const postData = {
    query: `query allOrdersOp {
                allOrders {
                  shipping_address {
                    city
                    state
                    country
                    state
                    street_address
                    zip_code
                  }
                }
              }`,
    operationName: "allOrdersOp"
  };
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);

  const { allOrders } = response.body.data;
  return allOrders;
};

const retrieveAllUserOrdersGraphQLRequest = async createdRequest => {
  const postData = {
    query: `query allUserOrdersOp {
                allUserOrders {
                  _id
                }
              }`,
    operationName: "allUserOrdersOp"
  };
  const response = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);

  const { allUserOrders } = response.body.data;
  return allUserOrders;
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

  await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(createBillingInfoPostData);
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;
  let productIdArr: IProductCreated[] = [];

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    await dropUserCollection();
    await dropOrderCollection();
    await createUser(adminUserCreateConfig);
    await loginUser(createdRequest, adminUserCreateConfig);
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
    productIdArr = [];
    productIdArr.push(productOne);
    productIdArr.push(productTwo);
    productIdArr.push(productThree);
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("creates a new order with user's billingInfo and removes cart from user", async () => {
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
    const result = await createOrderWithUsersBillingGraphQLRequest(
      createdRequest
    );
    const retrievedUser = await User.findOne({
      email: adminUserCreateConfig.email
    });
    expect((retrievedUser as any).cart).toBe(null);
    expect((retrievedUser as any).orders.length).toBe(1);
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

  test("creates a new order with shipping address entered by user and removes cart from user", async () => {
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
    const result = await createOrderWithShippingAddressGraphQLRequest(
      createdRequest,
      shippingAddressInput
    );

    const retrievedUser = await User.findOne({
      email: adminUserCreateConfig.email
    });
    console.log("THE RETRIEVED USER AFTER ORDER IS CREATED: ", retrievedUser);
    expect((retrievedUser as any).cart).toBe(null);
    expect(parseFloat(result.total_amount)).toBe(total);
    expect(result.after_tax_amount).toEqual(taxAmount.toFixed(2));
    expect(result.products[0]._id).toBe(productIdArr[0].productId);
    expect(result.products[1]._id).toBe(productIdArr[1].productId);
    expect(result.quantity).toEqual({
      [productIdArr[0].productId]: 2,
      [productIdArr[1].productId]: 4
    });
    expect(result.shipping_address).toEqual(shippingAddressInput);
  });

  test("retrieves all orders", async () => {
    await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice,
      quantity: 2
    });
    await createOrderWithShippingAddressGraphQLRequest(
      createdRequest,
      shippingAddressInput
    );
    await createUser(regularUserCreateConfig);
    await loginUser(createdRequest, regularUserCreateConfig);
    await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[1].productId,
      price: productIdArr[1].productPrice,
      quantity: 4
    });
    await createOrderWithShippingAddressGraphQLRequest(
      createdRequest,
      shippingAddressInputTwo
    );
    await loginUser(createdRequest, adminUserCreateConfig);
    const result = await retrieveAllOrdersGraphQLRequest(createdRequest);
    expect(result[0].shipping_address).toEqual(shippingAddressInput);
    expect(result[1].shipping_address).toEqual(shippingAddressInputTwo);
  });

  test("user retrieve all orders they created.", async () => {
    await createUser(regularUserCreateConfig);
    await loginUser(createdRequest, regularUserCreateConfig);
    await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice,
      quantity: 2
    });
    await createOrderWithShippingAddressGraphQLRequest(
      createdRequest,
      shippingAddressInput
    );
    await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[1].productId,
      price: productIdArr[1].productPrice,
      quantity: 4
    });
    await createOrderWithShippingAddressGraphQLRequest(
      createdRequest,
      shippingAddressInput
    );
    const result = await retrieveAllUserOrdersGraphQLRequest(createdRequest);
    expect(result.length).toBe(2);
  });
  // test("admin can retrieve all orders for the user who created the order.", async () => {}
  // test editOrder
  // test deleteOrder
});
