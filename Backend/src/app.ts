import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin:env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("DesignFlow API is running");
});


app.use(errorHandler);

export default app;