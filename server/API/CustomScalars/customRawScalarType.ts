import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

const customRawScalarType = new GraphQLScalarType({
  name: "Raw",
  serialize(value) {
    //  any kind of data
    return value;
  }
});

// type Query {
//   date: Date
// }
export const rawScalarSchema = `
  scalar Raw
`;

export const rawScalarResolver = {
  Raw: customRawScalarType
};

// const resolvers = {
//   MyCustomScalar: customDateScalarType
// };

// export const DateScalarSchema = makeExecutableSchema({
//   typeDefs: schemaString,
//   resolvers: DateScalarResolver
// });

// import { customDateScalarType } from "../../CustomScalars/customDateScalarType";
