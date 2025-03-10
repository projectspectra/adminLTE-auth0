import dotenv from "dotenv";
dotenv.config(); // push .env variables into process.env

import express, { Request } from "express";
import path from "path";
import { authConfig } from "./auth";
import router from "./routes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import expressLayouts from 'express-ejs-layouts';
import logger from "./utils/logger";
import "./types/express";
import { ApiError } from "./types/express";

const app = express();

// Body parsing middleware
app.use(express.json());                         // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
authConfig(app);

app.use(expressLayouts);
app.set('layout', '../views/structure/layout');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.env = process.env.NODE_ENV;

    const urlParts = req.url.substring(1).split("/");
    const pages: {title: string, href: string}[] = urlParts.map((page, index) => ({
        title: page,
        href: urlParts.slice(0, index + 1).join("/")
    }));
    res.locals.breadcrumbNames = pages;
    next();
});

morgan.token('userId', function (req: Request) { return req.user?.userId || 'SYSTEM' });
app.use(morgan('[DEBUG][:userId] :method :url :status :response-time ms - :res[content-length]'));
app.use("/", router);

app.use((error: ApiError, req: Request, res: express.Response, next: express.NextFunction) => {
    if(!(error instanceof ApiError)) {
        error = new ApiError(error);
    }
    logger.error(error, req.user?.userId);
    res.status(error.status).render("error", { error });
});

app.listen(3000, () => logger.log("Server running on http://localhost:3000"));