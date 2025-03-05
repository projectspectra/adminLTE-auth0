import express from "express";
import dotenv from "dotenv";
import path from "path";
import { authConfig } from "./auth";
import router from "./routes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { SessionUser } from "./types/SessionUser";
import expressLayouts from 'express-ejs-layouts';

dotenv.config();

const app = express();
app.use(morgan('dev'));

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
    // Set Ananymous User:
    if(!(req.user instanceof SessionUser))
        req.user = new SessionUser(req.user);

    res.locals.user = req.user;
    res.locals.env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    next();
});
app.use("/", router);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));