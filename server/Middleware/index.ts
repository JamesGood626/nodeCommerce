// const cors = require('cors')
// import { apolloUploadExpress } from 'apollo-upload-server'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import * as bcrypt from 'bcrypt';
import * as bodyParser from 'body-parser';
// import * as flash from 'connect-flash';
import * as connectRedis from 'connect-redis';
import * as expressGraphQL from 'express-graphql';
import * as session from 'express-session';
import * as mongoose from 'mongoose';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as redis from 'redis';
import { MergedGraphQLSchema } from '../API';
// import Schema from '../API/Accounts/Schema'
import { User } from '../API/Accounts/Models/user';
import {
  REDIS_SECRET,
  MONGO_URI
} from '../Config';

(mongoose as any).Promise = Promise;

const RedisStore = connectRedis(session);
const LocalStrategy = passportLocal.Strategy;

// Look into cors

export const initBodyParser = (app: any) => {
  // app.use(cors())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
};

export const initRedisSessionStore = (app: any) => {
  const client = redis.createClient();
  // connect express-session above graphql as it'll pass along authentication information
  app.use(session({
    // err 1. RedisStore was calling an experimental feature of the redis lib
    store: new RedisStore({client, unref: false}),
    secret: REDIS_SECRET,
    saveUninitialized: false,
    // option for cookie { secure: true } in prod
    cookie: { maxAge: 12000 },
    // look into whether store makes use of a 'touch' method
    // express-session docs claim there could be potential race conditions
    resave: false
  }));
  // 5 day expiry 5 * 24 * 60 * 60 * 1000
  app.use((req, res, next) => {
    if (!req.session) {
      return next(new Error('oh no')); // handle error
    }
    next(); // otherwise continue
  });
};

export const initPassport = (app: any) => {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done: any) => {
      const user = await User.findOne({ email })
        .then((result) => result)
        .catch((err) => console.log("Error retrieving user in passport strategy: ", err));
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!bcrypt.compareSync(password, (user as any).password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err: any, user: any) => {
      done(err, user);
    });
  });

  app.use(passport.initialize());
  // app.use(flash());
  app.use(passport.session());
};

export const initMongoMongooseConnection = async () => {
  await mongoose.connect(MONGO_URI).then((res) => console.log('mongo connected'));
};

export const initGraphQL = (app: any) => {
  app.use(
    '/graphql',
    // bodyParser.json(),
    graphqlExpress((req) => {
      return {
        schema: MergedGraphQLSchema,
        context: {
          req: req ? req : undefined
        }
      };
    })
  );

  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
};
