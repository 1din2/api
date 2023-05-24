import express from "express";
import http from "http";
import FacebookStrategy from "passport-facebook";
import { createApiContext } from "./container/api-context";
import rateLimit from "./rate-limit";
import passport from "passport";
import configuration from "./container/configuration";

passport.use(
  "facebook",
  new FacebookStrategy.Strategy(
    {
      clientID: configuration.facebook_app_id,
      clientSecret: configuration.facebook_app_secret,
      callbackURL: `${configuration.root_path}/auth/callback/facebook`,
      passReqToCallback: true,
    },
    function verify(req, _accessToken, _refreshToken, profile, done) {
      console.log("profile", profile);
      const apiContext = req.apiContext;
      apiContext.usecases.providerLogin
        .execute({ profile }, apiContext)
        .then((user) => done(null, user))
        .catch(done);
    }
  )
);

export default () => {
  const app = express();

  rateLimit(app);

  app.get("/favicon.ico", (_req, res) => res.sendStatus(204));
  app.get("/", (_req, res) => res.status(200).send("go to /graphql"));

  app.get("/auth/facebook", passport.authenticate("facebook"));
  app.get(
    "/auth/callback/facebook",
    passport.authenticate("facebook"),
    function (req, res) {
      console.log("user", req.user);
      res.redirect("/");
    }
  );

  app.use(async (req, _res, next) => {
    try {
      req.apiContext = await createApiContext(req);
      next();
    } catch (err) {
      next(err);
    }
  });

  const httpServer = http.createServer(app);

  return { app, httpServer };
};
