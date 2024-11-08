import express from "express";
import "express-async-errors";
import {
  NotFoundError,
  errorHandler,
  currentUser,
} from "@daticketslearning/common";
import cookieSession from "cookie-session";
import { newOrdersRouter } from "./routes/new";
import { showOrdersRouter } from "./routes/show";
import { indexOrdersRouter } from "./routes/index";
import { deleteOrdersRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: false,
  })
);

app.use(currentUser);

app.use(newOrdersRouter);
app.use(showOrdersRouter);
app.use(indexOrdersRouter);
app.use(deleteOrdersRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
