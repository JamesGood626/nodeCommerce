import * as request from "supertest";
import { app } from "../../../app";
import { User } from "../../Accounts/Models/user";
import { Product } from "../../Products/Models/product";
import { createUser } from "../../../Services/auth";
import { dropUserCollection } from "../../../Services/tests/test-helpers";
import { dropProductCollection } from "../../Products/tests/product.test";
import { String } from "../../../node_modules/aws-sdk/clients/sqs";
// Oh yeah.. cart is just a Sub Document on the User Model.
// Create and Add product to cart
// ****
// The product being added to cart should be in client's cache
// So when the post is made, the information from cache will be used
// as arguments to fulfill the mutation request.
// params: price/ sale_price (if applicable)
// ****
// Remove product from cart
// Retrieve all details of a cart.
// Edit quantity of a particular product in cart.
// Delete cart when it's empty (this will only be executed on removal of last item
// not a distinct post request)

interface IProductCreated {
  productId: string;
  productPrice: number;
}

const createCartGraphQLRequest = async (createdRequest, args): Promise<any> => {
  const cartCreateInput = {
    product_id: args.productId,
    price: args.price,
    quantity: args.quantity,
    sale_price: args.sale_price
  };
  const firstPostCreateData = {
    query: `mutation createCartOp($input: CartInput) {
                  createCart(input: $input) {
                    cart {
                      total_price_amount
                      quantity
                      products {
                        _id
                      }
                    }
                  }
                }`,
    operationName: "createCartOp",
    variables: {
      input: cartCreateInput
    }
  };

  const createdCartResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostCreateData);
  const createCartStatusCode = createdCartResponse.statusCode;
  const createCartData = createdCartResponse.body.data.createCart;
  return { createCartStatusCode, cartCreateInput, createCartData };
};

const editCartGraphQLRequest = async (createdRequest, args): Promise<any> => {
  const cartEditInput = {
    product_id: args.productId,
    price: args.price,
    quantity: args.quantity,
    sale_price: args.sale_price
  };
  const firstPostCreateData = {
    query: `mutation editCartOp($input: CartInput) {
                  editCart(input: $input) {
                    cart {
                      total_price_amount
                      quantity
                      products {
                        _id
                      }
                    }
                  }
                }`,
    operationName: "editCartOp",
    variables: {
      input: cartEditInput
    }
  };

  const editedCartResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(firstPostCreateData);
  const editCartData = editedCartResponse.body.data.editCart;
  const editCartStatusCode = editedCartResponse.statusCode;
  return { editCartStatusCode, cartEditInput, editCartData };
};

const removeProductGraphQLRequest = async (createdRequest, args) => {
  const postData = {
    query: `mutation removeProductOp($input: RemoveProductInput) {
                  removeProduct(input: $input) {
                    cart {
                      quantity
                      total_price_amount
                      products {
                        _id
                      }
                    }
                  }
                }`,
    operationName: "removeProductOp",
    variables: {
      input: {
        product_id: args.productId,
        price: args.price
      }
    }
  };

  const removeProductResponse = await createdRequest
    .post("/graphql")
    .set("Accept", "application/json")
    .type("form")
    .send(postData);

  const removeProductStatucCode = removeProductResponse.statusCode;
  const removeProductData = removeProductResponse.body.data.removeProduct;
  return { removeProductStatucCode, removeProductData };
};

const createProductGraphQLRequest = async (
  createdRequest,
  price,
  images
): Promise<any> => {
  const productCreateInput = {
    product_title: "Planet",
    description: "The most awesome product description.",
    price,
    images
  };
  const firstPostCreateData = {
    query: `mutation createProductOp($input: ProductInput) {
                  createProduct(input: $input) {
                    _id
                    price
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

  const productId: string = productCreateResponse.body.data.createProduct._id;
  const productPrice: number =
    productCreateResponse.body.data.createProduct.price;
  return { productId, productPrice };
};

describe("Test cart CRUD Operations via GraphQL queries and mutations", () => {
  let createdRequest;
  let server;
  let productIdArr: IProductCreated[] = [];

  beforeAll(async done => {
    server = await app.listen(done);
    createdRequest = await request.agent(server);
  });

  beforeEach(async () => {
    productIdArr = [];
    await dropUserCollection();
    await dropProductCollection();
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

    await createUser({
      email: "jessica@gmail.com",
      password: "password"
    });
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

    await createdRequest
      .post("/graphql")
      .set("Accept", "application/json")
      .type("form")
      .send(loginPostDataTwo);
  });

  afterAll(async () => {
    await dropProductCollection();
  });

  test("it creates a new cart and can add subsequent products", async () => {
    const {
      createCartStatusCode,
      cartCreateInput,
      createCartData
    } = await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice,
      quantity: 2
    });
    const firstExpectedTotalPrice =
      cartCreateInput.quantity * cartCreateInput.price;
    expect(createCartStatusCode).toBe(200);
    expect(createCartData.cart.total_price_amount).toBe(
      firstExpectedTotalPrice
    );
    expect(createCartData.cart.quantity[cartCreateInput.product_id]).toBe(2);
    expect(createCartData.cart.products.length).toBe(1);
    expect(createCartData.cart.products[0]._id).toBe(
      cartCreateInput.product_id
    );

    const {
      editCartStatusCode,
      cartEditInput,
      editCartData
    } = await editCartGraphQLRequest(createdRequest, {
      productId: productIdArr[1].productId,
      price: productIdArr[1].productPrice,
      quantity: 4
    });
    const secondExpectedTotalPrice =
      cartEditInput.quantity * cartEditInput.price;
    expect(editCartStatusCode).toBe(200);
    expect(editCartData.cart.total_price_amount).toBe(
      firstExpectedTotalPrice + secondExpectedTotalPrice
    );
    expect(editCartData.cart.quantity[cartEditInput.product_id]).toBe(4);
    expect(editCartData.cart.products.length).toBe(2);
    expect(editCartData.cart.products[0]._id).toBe(cartCreateInput.product_id);
    expect(editCartData.cart.products[1]._id).toBe(cartEditInput.product_id);
  });

  test("it removes products from cart", async () => {
    const firstProductQuantity = 2;
    const {
      createCartStatusCode,
      cartCreateInput,
      createCartData
    } = await createCartGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice,
      quantity: firstProductQuantity
    });
    expect(createCartStatusCode).toBe(200);

    const {
      editCartStatusCode,
      cartEditInput,
      editCartData
    } = await editCartGraphQLRequest(createdRequest, {
      productId: productIdArr[1].productId,
      price: productIdArr[1].productPrice,
      quantity: 4
    });
    expect(editCartStatusCode).toBe(200);
    expect(editCartData.cart.quantity[cartEditInput.product_id]).toBe(4);

    const {
      removeProductStatucCode,
      removeProductData
    } = await removeProductGraphQLRequest(createdRequest, {
      productId: productIdArr[0].productId,
      price: productIdArr[0].productPrice
    });
    expect(removeProductStatucCode).toBe(200);
    const totalPriceAmountWithTwoProducts =
      editCartData.cart.total_price_amount;
    const subtractedFirstProductPrice =
      firstProductQuantity * productIdArr[0].productPrice;
    const subtractionResult =
      totalPriceAmountWithTwoProducts - subtractedFirstProductPrice;
    expect(removeProductData.cart.total_price_amount).toBe(subtractionResult);
    expect(removeProductData.cart.products.length).toBe(1);
    expect(removeProductData.cart.products[0]._id).toBe(
      productIdArr[1].productId
    );
    const keys = Object.keys(removeProductData.cart.quantity);
    expect(keys.length).toBe(1);
    expect(removeProductData.cart.quantity[productIdArr[1].productId]).toBe(4);
  });
});
