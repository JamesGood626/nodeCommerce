import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
// import { makeExecutableSchema } from "graphql-tools";

const customDateScalarType = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  parseValue(value) {
    return new Date(value); // value from the client
  },
  serialize(value) {
    return value.getTime(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // ast value is always in string format
    }
    return null;
  }
});

// type Query {
//   date: Date
// }
export const dateScalarSchema = `
  scalar Date
`;

export const dateScalarResolver = {
  Date: customDateScalarType
};

// const resolvers = {
//   MyCustomScalar: customDateScalarType
// };

// export const DateScalarSchema = makeExecutableSchema({
//   typeDefs: schemaString,
//   resolvers: DateScalarResolver
// });

// import { customDateScalarType } from "../../CustomScalars/customDateScalarType";
