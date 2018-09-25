import { createUser } from "../../../AuthServices/auth";

export const createJessicaUserGraphQLRequest = async createdRequest => {
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
  await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);
};

export const createBillingInfoGraphQLRequest = async (
  createdRequest,
  input
) => {
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
      input
    }
  };

  return await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);
};

export const editBillingInfoGraphQLRequest = async (createdRequest, input) => {
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
      input
    }
  };

  return await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(editBillingInfoPostData);
};

export const deleteBillingInfoGraphQLRequest = async createdRequest => {
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

  return await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(deleteBillingInfoPostData);
};
