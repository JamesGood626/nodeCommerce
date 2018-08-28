import * as request from "supertest";
import { app } from "../../../app";
import { Product } from "../Models/product";
import { createUser } from "../../../Services/auth";
import { dropUserCollection } from "../../../Services/tests/test-helpers";

// TODO: add userReviews to the edit product test

const dropProductCollection = async () => {
  await Product.remove({}, err =>
    console.log("Product Collection Drop Error: ", err)
  );
  // Had to add this to facilitate creating two subsequent products
  // in the retrieve all products test. Otherwise I would receive a
  // duplicate key error index for images.
  await Product.collection.dropIndexes((err, result) => {
    console.log("The error dropping all indexes: ", err);
    console.log("The result dropping all indexes: ", result);
  });
};

describe("Test product CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    await dropUserCollection();
    await createUser("jessica@gmail.com", "password");
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

    await dropProductCollection();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully creates new product.", async done => {
    expect.assertions(9);
    // for verifying a correct date instance on the client.
    // date instanceof Date && !isNan(date.getTime())
    const mutationInput = {
      product_title: "Planet",
      description: "The most awesome product description.",
      price: 9.99,
      sale_price: 7.99,
      sale_price_start: new Date("2016-01-01T13:10:20Z"),
      sale_price_expiry: new Date("2016-01-04T13:10:20Z"),
      shipping_time: "3-4 days",
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
                      sale_price
                      sale_price_start
                      sale_price_expiry
                      shipping_time
                      images
                    }
                  }`,
      operationName: "createProductOp",
      variables: {
        input: mutationInput
      }
    };

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
        sale_price,
        sale_price_start,
        sale_price_expiry,
        shipping_time,
        images
      }
    } = response.body.data;
    // Front end will always need to use new Date on the response from graphql
    // console.log("THE SALE_PRICE_START: ", new Date(sale_price_start));
    expect((response as any).statusCode).toBe(200);
    expect(product_title).toBe(mutationInput.product_title);
    expect(description).toBe(mutationInput.description);
    expect(price).toBe(mutationInput.price);
    expect(sale_price).toBe(mutationInput.sale_price);
    expect(new Date(sale_price_start)).toEqual(mutationInput.sale_price_start);
    expect(new Date(sale_price_expiry)).toEqual(
      mutationInput.sale_price_expiry
    );
    expect(shipping_time).toBe(mutationInput.shipping_time);
    expect(images).toEqual(mutationInput.images);
    done();
  });

  test("GraphQL Mutation successfully retrieves all products.", async done => {
    expect.assertions(14);
    // for verifying a correct date instance on the client.
    // date instanceof Date && !isNan(date.getTime())
    const firstMutationCreateInput = {
      product_title: "Planet",
      description: "The most awesome product description.",
      price: 9.99,
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
    const firstPostCreateData = {
      query: `mutation createProductOp($input: ProductInput) {
                    createProduct(input: $input) {
                      _id
                    }
                  }`,
      operationName: "createProductOp",
      variables: {
        input: firstMutationCreateInput
      }
    };

    const firstCreateResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(firstPostCreateData);

    expect((firstCreateResponse as any).statusCode).toBe(200);

    const secondMutationCreateInput = {
      product_title: "Elve Figurine",
      description: "This product description is fire.",
      price: 29.99,
      images: ["prancer", "dancer", "vixen", "rudolph"]
    };
    const secondPostCreateData = {
      query: `mutation createProductOp($input: ProductInput) {
                      createProduct(input: $input) {
                        _id
                      }
                    }`,
      operationName: "createProductOp",
      variables: {
        input: secondMutationCreateInput
      }
    };

    const secondCreateResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(secondPostCreateData);

    expect((secondCreateResponse as any).statusCode).toBe(200);

    const postData = {
      query: `query allProductsOp {
                        allProducts {
                          _id
                          product_title
                          description
                          price
                          images
                        }
                      }`,
      operationName: "allProductsOp"
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const firstProductId = firstCreateResponse.body.data.createProduct._id;
    const secondProductId = secondCreateResponse.body.data.createProduct._id;
    const [firstProduct, secondProduct] = response.body.data.allProducts;
    expect((response as any).statusCode).toBe(200);
    expect(response.body.data.allProducts.length).toEqual(2);
    expect(firstProduct._id).toBe(firstProductId);
    expect(firstProduct.product_title).toBe(
      firstMutationCreateInput.product_title
    );
    expect(firstProduct.description).toBe(firstMutationCreateInput.description);
    expect(firstProduct.price).toBe(firstMutationCreateInput.price);
    expect(firstProduct.images).toEqual(firstMutationCreateInput.images);
    expect(secondProduct._id).toBe(secondProductId);
    expect(secondProduct.product_title).toBe(
      secondMutationCreateInput.product_title
    );
    expect(secondProduct.description).toBe(
      secondMutationCreateInput.description
    );
    expect(secondProduct.price).toBe(secondMutationCreateInput.price);
    expect(secondProduct.images).toEqual(secondMutationCreateInput.images);

    done();
  });

  test("GraphQL Mutation successfully edits product.", async done => {
    // expect.assertions(9);
    // for verifying a correct date instance on the client.
    // date instanceof Date && !isNan(date.getTime())
    const mutationCreateInput = {
      product_title: "Planet",
      description: "The most awesome product description.",
      price: 9.99,
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
    const postCreateData = {
      query: `mutation createProductOp($input: ProductInput) {
                    createProduct(input: $input) {
                      _id
                      product_title
                      description
                      price
                    }
                  }`,
      operationName: "createProductOp",
      variables: {
        input: mutationCreateInput
      }
    };

    const createResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postCreateData);

    const {
      createProduct: { _id, product_title, description, price }
    } = createResponse.body.data;
    expect((createResponse as any).statusCode).toBe(200);
    expect(product_title).toBe(mutationCreateInput.product_title);
    expect(description).toBe(mutationCreateInput.description);
    expect(price).toBe(mutationCreateInput.price);

    const mutationEditInput = {
      product_id: _id,
      product_title: "ExoPlanet",
      description: "The most epensive product description.",
      price: 19.99
    };
    const postEditData = {
      query: `mutation editProductOp($input: EditProductInput) {
                    editProduct(input: $input) {
                      _id
                      product_title
                      description
                      price
                    }
                  }`,
      operationName: "editProductOp",
      variables: {
        input: mutationEditInput
      }
    };

    const editResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postEditData);

    const { editProduct } = editResponse.body.data;
    expect((createResponse as any).statusCode).toBe(200);
    expect(editProduct.product_title).toBe(mutationEditInput.product_title);
    expect(editProduct.description).toBe(mutationEditInput.description);
    expect(editProduct.price).toBe(mutationEditInput.price);
    done();
  });

  test("GraphQL Mutation successfully prevents product deletion if not admin.", async done => {
    // expect.assertions(9);
    // for verifying a correct date instance on the client.
    // date instanceof Date && !isNan(date.getTime())
    const mutationCreateInput = {
      product_title: "Planet",
      description: "The most awesome product description.",
      price: 9.99,
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
    const postCreateData = {
      query: `mutation createProductOp($input: ProductInput) {
                    createProduct(input: $input) {
                      _id
                    }
                  }`,
      operationName: "createProductOp",
      variables: {
        input: mutationCreateInput
      }
    };

    const createResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postCreateData);

    expect((createResponse as any).statusCode).toBe(200);

    const {
      createProduct: { _id }
    } = createResponse.body.data;

    const mutationDeleteInput = {
      product_id: _id
    };
    const postDeleteData = {
      query: `mutation deleteProductOp($input: DeleteProductInput) {
                    deleteProduct(input: $input)
                  }`,
      operationName: "deleteProductOp",
      variables: {
        input: mutationDeleteInput
      }
    };

    const deleteResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postDeleteData);

    const { deleteProduct } = deleteResponse.body.data;
    expect((deleteResponse as any).statusCode).toBe(200);
    expect(deleteProduct).toBe(null);
    // expect(editProduct.product_title).toBe(mutationEditInput.product_title);
    // expect(editProduct.description).toBe(mutationEditInput.description);
    // expect(editProduct.price).toBe(mutationEditInput.price);

    const postData = {
      query: `query allProductsOp {
                        allProducts {
                          _id
                          product_title
                          description
                          price
                          images
                        }
                      }`,
      operationName: "allProductsOp"
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    expect((response as any).statusCode).toBe(200);
    expect(response.body.data.allProducts.length).toBe(1);
    done();
  });
});

// DELETE IS UP NEXT, THEN YOU CAN MOVE ON TO USER REVIEWS

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
