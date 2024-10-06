import express from "express";
import "express-async-errors";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@daticketslearning/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: true,
  })
);

app.use(currentUser);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
