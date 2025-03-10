import { Express, Request, Response } from "express";
import passport from "passport";
import { Strategy as OAuth2Strategy, VerifyCallback, VerifyFunction } from "passport-oauth2";
import session, { SessionOptions } from "express-session";
import jwkToPem from "jwk-to-pem";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SessionUser } from "./types/SessionUser";
import logger from "./utils/logger";
import FileStore from "session-file-store";

const verifyFn: VerifyFunction =
  (accessToken: string, refreshToken: string, profile: unknown, done: VerifyCallback) => {
    // logger.log(`Access Token: ${accessToken}\n\nRefresh Token: ${refreshToken}\n\nProfile: ${JSON.stringify(profile)}`);
    let decodedToken :JwtPayload = {
      'cognito:groups': []
    };

    try {
      // Verify Token
      const jwk = JSON.parse(process.env.COGNITO_JWK!);
      const pem = jwkToPem(jwk)
      jwt.verify(accessToken, pem)
      const tokenObject = jwt.decode(accessToken);
      if (typeof tokenObject === 'object' && tokenObject !== null) {
        decodedToken = tokenObject;
      }
    } catch (error :unknown) {
      logger.error('Error verifying token');
      logger.error(error);
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
      let sessionUser = new SessionUser(data);
      sessionUser.groups = decodedToken['cognito:groups'];

      logger.log(`User is a member of ${sessionUser.groups.join(', ')} groups.`, data);
      done(null, sessionUser);
    })
    .catch(error => {
      logger.error('Error fetching User info: ' + error.message);
      logger.error(error);
      done(error);
    })
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
  done(null, user);
});
passport.deserializeUser((obj: SessionUser, done) => {
  done(null, obj);
});

export function authConfig(app: Express) {
  const twenty4Hours = 24 * 60 * 60 * 1000; //ms
  const sessionOptions: SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    cookie: {
      secure: false,
      maxAge: twenty4Hours
    },
    resave: false,
    saveUninitialized: true
  };

  if (process.env.NODE_ENV !== 'production') {
    const FileStoreSession = FileStore(session);
    sessionOptions.store = new FileStoreSession({
      logFn: () => {},
      path: './sessions'
    });
  } else {
    sessionOptions.cookie!.secure = true
  }
  
  app.use(session(sessionOptions));
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
        res.redirect('/login');
      });
    });
  });
}