import express from "express";
import http from "http";
import FacebookStrategy from "passport-facebook";
import { createApiContext } from "./container/api-context";
import rateLimit from "./rate-limit";
import passport from "passport";
import configuration from "./container/configuration";
import { clearIpProject } from "./container/helpers/get-headers-data";
import { ProviderLoginOutput } from "./domain/user/usecase/provider-login-usecase";

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
      const user = req.user ? (req.user as ProviderLoginOutput) : null;
      const data = user
        ? {
            token: user.token,
            user: { id: user.user.id, displayName: user.user.displayName },
          }
        : null;
      res.send(`<h4>Closing...</h4>
<script type="text/javascript">
  (window.opener || window.parent).onLogin(JSON.parse(${JSON.stringify(data)}));
</script>`);
    }
  );

  const httpServer = http.createServer(app);

  return { app, httpServer };
};
