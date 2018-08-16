import { app, graphQLServer } from "./app";

export const server = app.listen(5000, () => {
  console.log(`Listening at localhost:5000${graphQLServer.graphqlPath}`);
});
