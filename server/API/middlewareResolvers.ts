import { AuthenticationError, ForbiddenError } from "apollo-server-express";

export const isUserAuthenticated = user => {
  if (typeof user === "undefined") {
    throw new AuthenticationError("Authentication required.");
  }
};

export const isAdmin = user => {
  isUserAuthenticated(user);
  if (!user.is_admin) {
    throw new ForbiddenError("User is not admin.");
  }
};

// This is what a thrown error response contains on response.body
// { data: { createBillingInfo: null },
// errors:
//   [ { message: 'User is not admin.',
//       locations: [Array],
//       path: [Array],
//       extensions: [Object] } ] }

// The code here under extensions:
// errors[0].extensions:  { message: 'User is not admin.',
//         locations: [ { line: 2, column: 21 } ],
//         path: [ 'editProduct' ],
//         extensions: { code: 'FORBIDDEN' } }

// There's also this
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   formatError: error => {
//     console.log(error);
//     return new Error("Internal server error");
//   }
// });
// Which is useful for formatting the error before sending it back to
// the client.
