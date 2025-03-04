import express from "express";
import dotenv from "dotenv";
import path from "path";
import { authConfig } from "./auth";
import router from "./routes";

dotenv.config();

const app = express();
authConfig(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", router);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));