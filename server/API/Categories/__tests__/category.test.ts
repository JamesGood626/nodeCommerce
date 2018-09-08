import * as request from "supertest";
import { app } from "../../../app";
import { createUser } from "../../../Services/auth";
import { Category } from "../Models/category";
import { dropUserCollection } from "../../../Services/testUtils/test-helpers";

const dropCategoryCollection = async () => {
  await Category.remove({}, err =>
    console.log("Category Collection Drop Error: ", err)
  );
  // Had to add this to facilitate creating two subsequent products
  // in the retrieve all products test. Otherwise I would receive a
  // duplicate key error index for images.
  // await Category.collection.dropIndexes((err, result) => {
  //   console.log("The error dropping all indexes: ", err);
  //   console.log("The result dropping all indexes: ", result);
  // });
};

describe("Test category CRUD Operations via GraphQL queries and mutations", () => {
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

    await dropCategoryCollection();
  });

  afterAll(async done => {
    await server.close(done);
  });

  test("GraphQL Mutation successfully creates a new category.", async () => {
    const input = {
      category_type: "pantelones"
    };
    const postData = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input
      }
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const { category_type } = response.body.data.createCategory;
    expect(category_type).toBe(input.category_type);
  });

  test("GraphQL Mutation prevents non admin user from creating category.", async () => {
    await createUser({
      email: "jessica@gmail.com",
      password: "password",
      is_admin: false
    });
    const loginPostData = {
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
    await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostData);

    const input = {
      category_type: "pantelones"
    };
    const postData = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input
      }
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const { createCategory } = response.body.data;
    expect(response.statusCode).toBe(200);
    expect(createCategory).toBe(null);
  });

  test("GraphQL Mutation successfully deletes a category if user is admin.", async () => {
    const input = {
      category_type: "pantelones"
    };
    const postData = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input
      }
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const { _id, category_type } = response.body.data.createCategory;
    expect(category_type).toBe(input.category_type);

    const deleteInput = {
      _id
    };
    const deletePostData = {
      query: `mutation deleteCategoryOp($input: DeleteCategoryInput) {
                    deleteCategory(input: $input)
                  }`,
      operationName: "deleteCategoryOp",
      variables: {
        input: deleteInput
      }
    };

    const deleteResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(deletePostData);
    expect((deleteResponse as any).statusCode).toBe(200);
    expect(deleteResponse.body.data.deleteCategory).toBe(true);
  });

  test("GraphQL Mutation prevents non admin user from deleting category.", async () => {
    const input = {
      category_type: "pantelones"
    };
    const postData = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input
      }
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const { _id, category_type } = response.body.data.createCategory;
    expect(category_type).toBe(input.category_type);

    await createUser({
      email: "jessica@gmail.com",
      password: "password",
      is_admin: false
    });
    const loginPostData = {
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
    await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostData);

    const deleteInput = {
      _id
    };
    const deletePostData = {
      query: `mutation deleteCategoryOp($input: DeleteCategoryInput) {
                    deleteCategory(input: $input)
                  }`,
      operationName: "deleteCategoryOp",
      variables: {
        input: deleteInput
      }
    };

    const deleteResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(deletePostData);
    expect((deleteResponse as any).statusCode).toBe(200);
    expect(deleteResponse.body.data.deleteCategory).toBe(null);
  });

  test("GraphQL Query successfully retrieves all categories.", async () => {
    const createInput = {
      category_type: "pantelones"
    };
    const postData = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input: createInput
      }
    };

    const createResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postData);

    const { createCategory } = createResponse.body.data;
    expect(createResponse.status).toBe(200);
    expect(createCategory.category_type).toBe(createInput.category_type);

    const createInputTwo = {
      category_type: "calcetines"
    };
    const postDataTwo = {
      query: `mutation createCategoryOp($input: CreateCategoryInput) {
                    createCategory(input: $input) {
                      _id
                      category_type
                    }
                  }`,
      operationName: "createCategoryOp",
      variables: {
        input: createInputTwo
      }
    };

    const createResponseTwo = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postDataTwo);

    const createCategoryTwo = createResponseTwo.body.data.createCategory;
    expect(createResponse.status).toBe(200);
    expect(createCategoryTwo.category_type).toBe(createInputTwo.category_type);

    const postDataThree = {
      query: `query allCategoriesOp {
                    allCategories {
                      _id
                      category_type
                    }
                  }`,
      operationName: "allCategoriesOp"
    };

    const response = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(postDataThree);

    const { allCategories } = response.body.data;
    expect(response.status).toBe(200);
    expect(allCategories.length).toBe(2);
  });
});
