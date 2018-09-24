import * as request from "supertest";
import { app } from "../../../app";
import { Product } from "../Models/product";
import { createUser } from "../../../AuthServices/auth";
import { dropUserCollection } from "../../../AuthServices/testUtils/test-helpers";

// TODO: add userReviews to the edit product test

// Last left off trying to figure out why the admin user created and logged in
// in the before each is creating the product, but I get an error when it's time to edit.
// Need to see if response is 200, and if perhaps the session timeout is set too short.
export const dropProductCollection = async () => {
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
    await createUser({
      email: "admin@gmail.com",
      password: "password",
      is_admin: true
    });
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
    await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostData);

    await dropProductCollection();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully retrieves all products", async done => {
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

  test("GraphQL Mutation allows new product to be created if user is admin", async done => {
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

  test("GraphQL Mutation prevents product from being created if user isn't admin", async done => {
    expect.assertions(7);
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

    expect((createResponse as any).statusCode).toBe(200);

    await createUser({ email: "jessica@gmail.com", password: "password" });
    const loginPostDataTwo = {
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
    const loginResponseTwo = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostDataTwo);

    expect((loginResponseTwo as any).statusCode).toBe(200);

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

    const { createProduct } = secondCreateResponse.body.data;
    const [error] = secondCreateResponse.body.errors;
    expect((secondCreateResponse as any).statusCode).toBe(200);
    expect(createProduct).toBe(null);
    expect(error.message).toBe("User is not admin.");
    expect(error.extensions.code).toBe("FORBIDDEN");
    done();
  });

  test("GraphQL Mutation prevents product from being edited if user isn't admin", async done => {
    expect.assertions(6);
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
      createProduct: { _id }
    } = createResponse.body.data;
    expect((createResponse as any).statusCode).toBe(200);

    await createUser({ email: "jessica@gmail.com", password: "password" });
    const loginPostDataTwo = {
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
    const loginResponseTwo = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostDataTwo);

    expect((loginResponseTwo as any).statusCode).toBe(200);

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
    const [error] = editResponse.body.errors;
    expect((editResponse as any).statusCode).toBe(200);
    expect(editProduct).toBe(null);
    expect(error.message).toBe("User is not admin.");
    expect(error.extensions.code).toBe("FORBIDDEN");
    done();
  });

  test("GraphQL Mutation allows product to be edited if user is admin", async done => {
    expect.assertions(7);
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

    const { createProduct } = createResponse.body.data;
    const createdProductId = createProduct._id;
    expect((createResponse as any).statusCode).toBe(200);
    expect(createProduct.product_title).toBe(mutationCreateInput.product_title);
    expect(createProduct.description).toBe(mutationCreateInput.description);
    expect(createProduct.price).toBe(mutationCreateInput.price);

    const mutationEditInput = {
      product_id: createdProductId,
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

    const {
      editProduct: { _id, product_title }
    } = editResponse.body.data;
    expect((editResponse as any).statusCode).toBe(200);
    expect(_id).toBe(createdProductId);
    expect(product_title).toBe(mutationEditInput.product_title);
    done();
  });

  test("GraphQL Mutation successfully prevents product deletion if not admin", async done => {
    expect.assertions(8);
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

    await createUser({ email: "jessica@gmail.com", password: "password" });
    const loginPostDataTwo = {
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
    const loginResponseTwo = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostDataTwo);

    expect((loginResponseTwo as any).statusCode).toBe(200);

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
    const [error] = deleteResponse.body.errors;
    expect((deleteResponse as any).statusCode).toBe(200);
    expect(error.message).toBe("User is not admin.");
    expect(error.extensions.code).toBe("FORBIDDEN");
    expect(deleteProduct).toBe(null);

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

  test("GraphQL Mutation allows product deletion if user is admin", async done => {
    expect.assertions(5);
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
    expect(deleteProduct).toBe(true);

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
    expect(response.body.data.allProducts.length).toBe(0);
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
