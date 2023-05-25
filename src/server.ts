import express from "express";
import http from "http";
import FacebookStrategy from "passport-facebook";
import { createApiContext } from "./container/api-context";
import rateLimit from "./rate-limit";
import passport from "passport";
import configuration from "./container/configuration";
import { clearIpProject } from "./container/helpers/get-headers-data";

passport.use(
  "facebook",
  new FacebookStrategy.Strategy(
    {
      clientID: configuration.facebook_app_id,
      clientSecret: configuration.facebook_app_secret,
      callbackURL: `${configuration.root_path}/auth/callback/facebook`,
      passReqToCallback: true,
      profileFields: ["email", "id", "displayName", "photos", "name"],
    } as never,
    function verify(req, _accessToken, _refreshToken, profile, done) {
      console.log("profile", profile, req.query);
      const apiContext = req.apiContext;
      delete profile._json;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (profile as any)._raw;
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
  app.get("/", (_req, res) => res.sendStatus(200));

  app.use(async (req, res, next) => {
    try {
      req.apiContext = await createApiContext({ req, res });
      next();
    } catch (err) {
      next(err);
    }
  });

  app.get("/auth/facebook", (req, res, next) => {
    passport.authenticate("facebook", { session: false })(req, res, next);
  });
  app.get(
    "/auth/callback/facebook",
    passport.authenticate("facebook", { session: false }),
    function (req, res) {
      clearIpProject(req.ip);
      console.log("user", req.user, req.query);
      res.redirect("/");
    }
  );

  const httpServer = http.createServer(app);

  return { app, httpServer };
};
