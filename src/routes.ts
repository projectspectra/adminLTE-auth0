import { Router, Request, Response } from "express";

const router = Router();

function isAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) return next();
  else {
    console.error('User not authenticated');
    res.redirect("/login");
  }
}

router.get("/", (req: Request, res: Response) => {
  res.render("index", { user: req.user ?? null });
});

router.get("/dashboard", isAuthenticated, (req: Request, res: Response) => {
  res.render("dashboard", { user: req.user });
});

export default router;