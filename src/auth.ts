import { Request, Response } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback, VerifyFunction } from "passport-oauth2";
import session from "express-session";
import dotenv from "dotenv";
import jwkToPem from "jwk-to-pem";
import jwt from "jsonwebtoken";

dotenv.config();
const verifyFn: VerifyFunction =
  (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
    console.log(`Access Token: ${accessToken}\n\nRefresh Token: ${refreshToken}\n\nProfile: ${JSON.stringify(profile)}`);

    try {
      // Verify Token
      const jwk = JSON.parse(process.env.COGNITO_JWK!);
      const pem = jwkToPem(jwk)
      jwt.verify(accessToken, pem)
    } catch (error) {
      console.error('Error verifying token:', error);
      return done(error);
    }
    
    // Get User Info
    fetch(`https://${process.env.COGNITO_DOMAIN!}/oauth2/userInfo`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Logged In User Data: ${JSON.stringify(data)}`);
      done(null, data);
    })
    .catch(error => {
      console.error('Error fetching User info:', error);
      done(error);
    });
  };

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `https://${process.env.COGNITO_DOMAIN!}/login`,
      tokenURL: `https://${process.env.COGNITO_DOMAIN!}/oauth2/token`,
      clientID: process.env.COGNITO_APP_CLIENT_ID!,
      clientSecret: process.env.COGNITO_APP_CLIENT_SECRET!,
      callbackURL: process.env.COGNITO_APP_CLIENT_CALLBACK_URL!,
      scope: 'openid'
    }, verifyFn)
);

passport.serializeUser((user, done) => {
  done(null, user)
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj)
});

export function authConfig(app: any) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      cookie: {},
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Route to initiate login
  app.get('/login', passport.authenticate('oauth2'));

  // Callback route after Cognito authentication
  app.get('/callback', passport.authenticate('oauth2', {
    failWithError: true,
    successRedirect: '/dashboard'
  }));

  // Logout route
  app.get('/logout', (req: Request, res: Response) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  });
}