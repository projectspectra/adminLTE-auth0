import { Request, Response } from "express";
import passport from "passport";
import { Strategy as CognitoStrategy } from "passport-cognito";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
passport.use(
  new CognitoStrategy(
    {
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      clientId: process.env.COGNITO_CLIENT_ID!,
      region: process.env.COGNITO_REGION!
    },
    (accessToken, idToken, refreshToken, user, done) => {
      console.log(accessToken, idToken, refreshToken, user);
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export function authConfig(app: any) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get(
    "/login",
    passport.authenticate("cognito", { scope: ["email", "openid"] })
  );
  app.get(
    "/callback",
    passport.authenticate("cognito", { failureRedirect: "/" }),
    (req: Request, res: Response) => res.redirect("/dashboard")
  );
  app.get("/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) return res.send("Error logging out");
      res.redirect("/");
    });
  });
}