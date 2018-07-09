import * as passport from "passport";

// Services is pretty much the API with GraphQL

export const authRouter = (app: any) => {
  app.get("/", (req, res) => {
    // Sucessfully logs a session with a cookie!
    console.log("THE REQ.SESSION: ", req.session);
    console.log("THE REQ.USER: ", req.user);
  });

  // app.post('/register', (req, res) => {

  // })

  // app.post('/login', function(req, res) {
  //   console.log(req)
  // })

  // app.post('/login',
  //   passport.authenticate('local', { failureRedirect: '/failed' }),
  //   function(req, res) {
  //     // all user info req.user
  //     // the user id to be used for future request auth req.session.passport.user
  //   }
  // )

  // req.session.passport.user wasn't remaining on subsequent requests
  // because I didn't ssave the session like below

  // app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
  //   console.log('this be the req session: ', req.session)
  //   req.session.save((err) => {
  //     if (err) {
  //         return next(err)
  //     }
  //     console.log('req.session saved, this is req: ', req.user)
  //   })
  //   return req.user
  // })

  app.get("/login", (req, res) => {
    console.log("the user on the login route: ", req.session.passport.user);
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/failed", (req, res) => {
    res.send("login failed");
  });

  // app.get('/check', (req, res) => {
  //   console.log(req.secure)
  //   res.send("did it")
  // })

  app.post("/image-submit", (req, res) => {
    console.log(req.body);
  });

  // app.post('/login', passport.authenticate('local', { failureRedirect: '/', failureFlash: true }), (req, res, next) => {
  //   req.session.save((err) => {
  //       if (err) {
  //           return next(err);
  //       }
  //       console.log('before redirect: ', req)
  //       res.redirect('/')
  //   })
  // })
};
