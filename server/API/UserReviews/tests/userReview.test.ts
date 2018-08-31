import * as request from "supertest";
import { app } from "../../../app";
import { UserReview } from "../Models/userReview";
// import { Product } from "../../Products/Models/product";
import { createUser } from "../../../Services/auth";
import { dropUserCollection } from "../../../Services/tests/test-helpers";

const createReviewGraphQLRequest = async (
  createdRequest,
  productId
): Promise<any> => {
  const reviewCreateInput = {
    rating: 4,
    comment: "The bestest product ever.",
    product_reviewed: productId
  };
  const firstPostCreateData = {
    query: `mutation createReviewOp($input: CreateUserReviewInput) {
                  createReview(input: $input) {
                    _id
                  }
                }`,
    operationName: "createReviewOp",
    variables: {
      input: reviewCreateInput
    }
  };

  const createdReviewResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostCreateData);
  const createdReviewId = createdReviewResponse.body.data.createReview._id;
  const createReviewStatusCode = createdReviewResponse.statusCode;
  console.log(createdReviewResponse.body);

  return { createReviewStatusCode, createdReviewId, reviewCreateInput };
};

const createProductGraphQLRequest = async (createdRequest): Promise<any> => {
  const productCreateInput = {
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
      input: productCreateInput
    }
  };

  const productCreateResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostCreateData);

  const productId = productCreateResponse.body.data.createProduct._id;

  return { productId, productCreateInput };
};

const dropUserReviewCollection = async () => {
  await UserReview.remove({}, err =>
    console.log("UserReview Collection Drop Error: ", err)
  );
  await UserReview.collection.dropIndexes((err, result) => {
    console.log("The error dropping all indexes: ", err);
    console.log("The result dropping all indexes: ", result);
  });
};

describe("Test user review CRUD Operations via GraphQL queries and mutations", () => {
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

    await dropUserReviewCollection();
  });

  test("it creates a new user review if user is admin in.", async () => {
    const { productId, productCreateInput } = await createProductGraphQLRequest(
      createdRequest
    );
    expect(productId).not.toBe(null);
    console.log("typeof productId: ", typeof productId);
    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    const userReview = await UserReview.findById(createdReviewId)
      .populate("reviewer")
      .populate("product_reviewed")
      .then(result => result);
    console.log(userReview);
    expect(createReviewStatusCode).toBe(200);
    expect((userReview as any).rating).toBe(reviewCreateInput.rating);
    expect((userReview as any).comment).toBe(reviewCreateInput.comment);
    expect((userReview as any).product_reviewed._id.toString()).toBe(productId);
    // https://github.com/facebook/jest/issues/5998
    expect(
      JSON.parse(JSON.stringify((userReview as any).product_reviewed.images))
    ).toEqual(productCreateInput.images);
    expect((userReview as any).product_reviewed.product_title).toBe(
      productCreateInput.product_title
    );
    expect((userReview as any).product_reviewed.description).toBe(
      productCreateInput.description
    );
    expect((userReview as any).product_reviewed.price).toBe(
      productCreateInput.price
    );
    expect((userReview as any).reviewer.is_admin).toBe(true);
  });
});
