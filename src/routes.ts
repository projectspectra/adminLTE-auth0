import { Router, Request, Response, NextFunction } from "express";
import logger from "./utils/logger";

const router = Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    if (req.user.email === 'an@ny.mous') {
      logger.log('Anonymous user. Redirecting to logout.');
      res.redirect("/logout");
    } else {
      next();
    }
  } else {
    logger.log('Redirecting to login.');
    res.redirect("/login");
  }
}

const renderAuthenticatedPage = (router: Router, pageName: string, alias?: string) => {
  if (alias !== undefined) {
    router.get("/" + alias, isAuthenticated, (_, res: Response) => {
      res.redirect(pageName);
    });
  } else {
    router.get("/" + pageName, isAuthenticated, (_, res: Response) => {
      res.render(pageName);
    });  
  }
};

// Render dashboard as main page.
renderAuthenticatedPage(router, "dashboard");
renderAuthenticatedPage(router, "dashboard", '');

// Render all other pages.
renderAuthenticatedPage(router, "calibrations");

export default router;
