import * as request from "supertest";
import { app } from "../../../app";
import { UserReview } from "../Models/userReview";
import { User } from "../../Accounts/Models/user";
// import { Product } from "../../Products/Models/product";
import { dropProductCollection } from "../../Products/tests/product.test";
import { createUser } from "../../../Services/auth";
import { dropUserCollection } from "../../../Services/tests/test-helpers";

const allUserReviewsGraphQLRequest = async (createdRequest): Promise<any> => {
  const firstPostEditData = {
    query: `query allUserReviewsOp {
                  allUserReviews {
                    _id
                    rating
                  }
                }`,
    operationName: "allUserReviewsOp"
  };

  const allUserReviewsResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostEditData);

  const allUserReviewsStatusCode = allUserReviewsResponse.statusCode;
  const { allUserReviews } = allUserReviewsResponse.body.data;
  return { allUserReviewsStatusCode, allUserReviews };
};

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

  return { createReviewStatusCode, createdReviewId, reviewCreateInput };
};

const editReviewGraphQLRequest = async (createdRequest, reviewId): Promise<any> => {
  const reviewEditInput = {
    _id: reviewId,
    rating: 2,
    comment: "Actually, after using it more, the quality could be improved."
  };
  const firstPostEditData = {
    query: `mutation editReviewOp($input: EditUserReviewInput) {
                  editReview(input: $input) {
                    _id
                    rating
                    comment
                  }
                }`,
    operationName: "editReviewOp",
    variables: {
      input: reviewEditInput
    }
  };

  const updatedReviewResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostEditData);

  const updatedReviewStatusCode = updatedReviewResponse.statusCode;
  const editReviewNullCheck = updatedReviewResponse.body.data.editReview;
  if (editReviewNullCheck) {
    const updatedReviewId = updatedReviewResponse.body.data.editReview._id;
    return { updatedReviewStatusCode, updatedReviewId, reviewEditInput };
  } else {
    return { updatedReviewStatusCode, editReviewNullCheck };
  }
};

const deleteReviewGraphQLRequest = async (
  createdRequest,
  reviewId
): Promise<any> => {
  const reviewDeleteInput = {
    _id: reviewId
  };
  const firstPostEditData = {
    query: `mutation deleteReviewOp($input: DeleteUserReviewInput) {
                  deleteReview(input: $input)
                }`,
    operationName: "deleteReviewOp",
    variables: {
      input: reviewDeleteInput
    }
  };

  const deletedReviewResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostEditData);

  const deletedReviewStatusCode = deletedReviewResponse.statusCode;
  const deletedReviewNullCheck = deletedReviewResponse.body.data.deleteReview;
  if (deletedReviewNullCheck) {
    const { deleteReview } = deletedReviewResponse.body.data;
    return { deletedReviewStatusCode, deleteReview };
  } else {
    return { deletedReviewStatusCode, deletedReviewNullCheck };
  }
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

  const productCreateStatusCode = productCreateResponse.statusCode;
  const productId = productCreateResponse.body.data.createProduct._id;
  return { productId, productCreateInput, productCreateStatusCode };
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
    await dropProductCollection();
  });

  test("it creates a new user review.", async () => {
    const { productId, productCreateInput } = await createProductGraphQLRequest(
      createdRequest
    );
    expect(productId).not.toBe(null);
    const firstReviewCreation = await createReviewGraphQLRequest(
      createdRequest,
      productId
    );
    const secondReviewCreation = await createReviewGraphQLRequest(
      createdRequest,
      productId
    );
    expect(firstReviewCreation.createReviewStatusCode).toBe(200);
    expect(secondReviewCreation.createReviewStatusCode).toBe(200);

    const {
      allUserReviewsStatusCode,
      allUserReviews
    } = await allUserReviewsGraphQLRequest(createdRequest);
    expect(allUserReviewsStatusCode).toBe(200);
    expect(allUserReviews.length).toBe(2);
  });

  test("it retrieves all user reviews.", async () => {
    const { productId, productCreateInput } = await createProductGraphQLRequest(
      createdRequest
    );
    expect(productId).not.toBe(null);
    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    const userReview = await UserReview.findById(createdReviewId)
      .populate("reviewer")
      .populate("product_reviewed")
      .then(result => result);
    const retrievedUser = await User.findOne({
      email: "admin@gmail.com"
    }).then(result => result);
    // test that userReview date is a date
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
    expect(
      (userReview as any).product_reviewed.user_reviews[0].toString()
    ).toBe(createdReviewId);
    expect((userReview as any).product_reviewed.price).toBe(
      productCreateInput.price
    );
    expect((retrievedUser as any).user_reviews[0].toString()).toBe(
      createdReviewId
    );
  });

  test("it edits a user review.", async () => {
    const {
      productId,
      productCreateInput,
      productCreateStatusCode
    } = await createProductGraphQLRequest(createdRequest);
    expect(productCreateStatusCode).toBe(200);
    expect(productId).not.toBe(null);
    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    expect(createReviewStatusCode).toBe(200);
    const {
      updatedReviewStatusCode,
      updatedReviewId,
      reviewEditInput
    } = await editReviewGraphQLRequest(createdRequest, createdReviewId);
    const userReview = await UserReview.findById(createdReviewId).then(
      result => result
    );
    const retrievedUser = await User.findOne({
      email: "admin@gmail.com"
    }).then(result => result);
    expect(updatedReviewStatusCode).toBe(200);
    expect(updatedReviewId).toBe(createdReviewId);
    expect((userReview as any).rating).toBe(reviewEditInput.rating);
    expect((userReview as any).comment).toBe(reviewEditInput.comment);
    expect((userReview as any).reviewer).toEqual((retrievedUser as any)._id);
    expect((userReview as any).product_reviewed.toString()).toEqual(productId);
    expect((userReview as any).comment).toBe(reviewEditInput.comment);
  });

  test("it edits a user review.", async () => {
    const {
      productId,
      productCreateInput,
      productCreateStatusCode
    } = await createProductGraphQLRequest(createdRequest);
    expect(productCreateStatusCode).toBe(200);
    expect(productId).not.toBe(null);
    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    expect(createReviewStatusCode).toBe(200);
    const {
      updatedReviewStatusCode,
      updatedReviewId,
      reviewEditInput
    } = await editReviewGraphQLRequest(createdRequest, createdReviewId);
    const userReview = await UserReview.findById(createdReviewId).then(
      result => result
    );
    const retrievedUser = await User.findOne({
      email: "admin@gmail.com"
    }).then(result => result);
    expect(updatedReviewStatusCode).toBe(200);
    expect(updatedReviewId).toBe(createdReviewId);
    expect((userReview as any).rating).toBe(reviewEditInput.rating);
    expect((userReview as any).comment).toBe(reviewEditInput.comment);
    expect((userReview as any).reviewer).toEqual((retrievedUser as any)._id);
    expect((userReview as any).product_reviewed.toString()).toEqual(productId);
    expect((userReview as any).comment).toBe(reviewEditInput.comment);
  });

  test("it returns null if non owner of review attempts to edit.", async () => {
    const {
      productId,
      productCreateInput,
      productCreateStatusCode
    } = await createProductGraphQLRequest(createdRequest);
    expect(productCreateStatusCode).toBe(200);
    expect(productId).not.toBe(null);

    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    expect(createReviewStatusCode).toBe(200);

    await createUser({
      email: "jessica@gmail.com",
      password: "password"
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
    const loggedInResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostData);

    expect(loggedInResponse.statusCode).toBe(200);
    expect(loggedInResponse.body.data.loginUser.email).toBe(
      "jessica@gmail.com"
    );

    const {
      updatedReviewStatusCode,
      editReviewNullCheck
    } = await editReviewGraphQLRequest(createdRequest, createdReviewId);
    expect(updatedReviewStatusCode).toBe(200);
    expect(editReviewNullCheck).toBe(null);
  });

  test("it deletes user review.", async () => {
    const {
      productId,
      productCreateInput,
      productCreateStatusCode
    } = await createProductGraphQLRequest(createdRequest);
    expect(productCreateStatusCode).toBe(200);
    expect(productId).not.toBe(null);

    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    expect(createReviewStatusCode).toBe(200);

    const {
      deletedReviewStatusCode,
      deleteReview
    } = await deleteReviewGraphQLRequest(createdRequest, createdReviewId);
    expect(deletedReviewStatusCode).toBe(200);
    expect(deleteReview).toBe(true);

    const {
      allUserReviewsStatusCode,
      allUserReviews
    } = await allUserReviewsGraphQLRequest(createdRequest);
    expect(allUserReviewsStatusCode).toBe(200);
    expect(allUserReviews.length).toBe(0);
  });

  test("it prevents user review deletion if user is not owner.", async () => {
    const {
      productId,
      productCreateInput,
      productCreateStatusCode
    } = await createProductGraphQLRequest(createdRequest);
    expect(productCreateStatusCode).toBe(200);
    expect(productId).not.toBe(null);

    const {
      createReviewStatusCode,
      createdReviewId,
      reviewCreateInput
    } = await createReviewGraphQLRequest(createdRequest, productId);
    expect(createReviewStatusCode).toBe(200);

    await createUser({
      email: "jessica@gmail.com",
      password: "password"
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
    const loggedInResponse = await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostData);

    expect(loggedInResponse.statusCode).toBe(200);
    expect(loggedInResponse.body.data.loginUser.email).toBe(
      "jessica@gmail.com"
    );

    const {
      deletedReviewStatusCode,
      deletedReviewNullCheck
    } = await deleteReviewGraphQLRequest(createdRequest, createdReviewId);
    expect(deletedReviewStatusCode).toBe(200);
    expect(deletedReviewNullCheck).toBe(null);

    const {
      allUserReviewsStatusCode,
      allUserReviews
    } = await allUserReviewsGraphQLRequest(createdRequest);
    expect(allUserReviewsStatusCode).toBe(200);
    expect(allUserReviews.length).toBe(1);
  });
});
