import { Router, Request, Response } from "express";
import { SessionUser } from "./types/SessionUser";

const router = Router();

function isAuthenticated(req: Request, res: Response, next: Function) {
  console.log('Checking if user is authenticated', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    if ((req.user as SessionUser).name === 'Anonymous') {
      res.redirect("/logout");
    } else {
      next();
    }
  }
  else {
    console.error('User not authenticated');
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
