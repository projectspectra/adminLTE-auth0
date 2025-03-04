import { Router, Request, Response } from "express";
const router = Router();

function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get("/", (req: Request, res: Response) => {
  res.render("index", { user: req.user });
});
router.get("/dashboard", isAuthenticated, (req: Request, res: Response) => {
  res.render("dashboard", { user: req.user });
});

export default router;