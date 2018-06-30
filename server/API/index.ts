import { mergeSchemas } from 'graphql-tools';
import userSchema from './Accounts/Schema';
import userReviewSchema from './UserReviews/Schema';

export const MergedGraphQLSchema = mergeSchemas({
  schemas: [
    userSchema,
    userReviewSchema,
  ]
});
