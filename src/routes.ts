import { Router, Request, Response, NextFunction } from "express";
import logger from "./utils/logger";

const router = Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  logger.log(`Checking if user is authenticated ${req.isAuthenticated()}`, req.user?.sub);
  
  if (req.isAuthenticated()) {
    if (req.user.email === 'an@ny.mous') {
      res.redirect("/logout");
    } else {
      next();
    }
  }
  else {
    logger.error('User not authenticated', req.user?.sub);
    res.redirect("/login");
  }
}

const renderPage = (router: Router, pageName: string, alias?: string) => {
  if (alias) {
    router.get("/" + alias, (_, res: Response) => {
      res.redirect(pageName);
    });
  } else {
    router.get("/" + pageName, isAuthenticated, (req: Request, res: Response) => {
      res.render(pageName);
    });  
  }
};

renderPage(router, "dashboard");
renderPage(router, "dashboard", '/');
renderPage(router, "dashboard", '');
renderPage(router, 'dashboard', 'calibration');

export default router;
