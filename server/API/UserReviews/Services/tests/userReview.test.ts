import * as request from 'supertest';
import { app } from ',,/../../app';
import { createUser } from '../../../../Services/auth';
// import { User } from '../../API/Accounts/Models/user';

// describe('Test passport functionality', () => {
//   let createdRequest;
//   let server;

//   beforeAll(async (done) => {
//     server = await app.listen(done);
//     createdRequest = await request.agent(server);
//   });

//   beforeEach(async () => {
//     await dropUserCollection();
//   });

//   afterAll(async (done) => {
//     await server.close(done);
//   });

//   test('GraphQL Mutation successfully logs in a user.', async (done) => {
//     expect.assertions(2);
//     await createUser('richard@gmail.com', 'password');
//     const postData = {
//       query: `mutation loginUserOp($email: String!, $password: String!) {
//                   loginUser(email: $email, password: $password) {
//                     email
//                   }
//                 }`,
//       operationName: 'loginUserOp',
//       variables: {
//         email: 'richard@gmail.com',
//         password: 'password'
//       }
//     };
//     const response = await createdRequest.post('/graphql')
//                       .set('Accept', 'application/json')
//                       .type('form')
//                       .send(postData);
//     // console.log("THE RESPONSE.BODY INSIDE OF GRAPHQL MUTATION TEST: ", response.body);
//     expect((response as any).statusCode).toBe(200);
//     expect(response.body.data.loginUser.email).toBe('richard@gmail.com');
//     done();
//   });
// });