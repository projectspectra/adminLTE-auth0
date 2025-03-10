import { Router, Request, Response, NextFunction } from "express";
import logger from "./utils/logger";
import { ApiError } from "./types/express";

const router = Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    if (req.user.email === 'an@ny.mous') {
      logger.warn('Session dropped. Redirecting to logout.');
      res.redirect("/logout");
    } else {
      next();
    }
  } else {
    logger.log('Redirecting to login.');
    res.redirect("/login");
  }
}

/*
  Render authenticated page
  @param router - Express Router
  @param pageName - Name of the page to render
  @param allowedGroups - Array of allowed groups, if empty, all authenticated users can access
  @param alias - Optional alias for the route
*/
const renderAuthenticatedPage = (router: Router, pageName: string, requireGroups: string[], alias?: string) => {
  if (alias !== undefined) {
    router.get("/" + alias, isAuthenticated, (_, res: Response) => {
      res.redirect(pageName);
    });
  } else {
    router.get("/" + pageName, isAuthenticated, (req: Request, res: Response) => {
      if (requireGroups.length > 0 && !requireGroups.some(allow => req.user?.groups.includes(allow))) {
        logger.warn(`User doesn't have one of the required groups: ${requireGroups.join(', ')}`, req.user?.userId);
        throw new ApiError('Forbidden!', 403);
      } else {
        res.render(pageName);
      }
    });
  }
};

// Render dashboard as main page.
renderAuthenticatedPage(router, "dashboard", []);
renderAuthenticatedPage(router, "dashboard", [], '');
renderAuthenticatedPage(router, "error", []);

// Render all other pages.
renderAuthenticatedPage(router, "calibrations", []);

export default router;
