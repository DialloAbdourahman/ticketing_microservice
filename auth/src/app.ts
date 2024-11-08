import express from "express";
import "express-async-errors";
import { authRouter } from "./routes/auth";
import { NotFoundError, errorHandler } from "@daticketslearning/common";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true); // To tell express to trust traffic as being secure even though it is coming from the ingress proxy
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // Make sure that the cookie is not encrypted to assure reusability across different languages.
    secure: false, // In prod, it is true but in test it should be false since jest is http not https
    // secure: false,
  })
);

app.use("/api/users", authRouter);

app.all("*", () => {
  throw new NotFoundError();
});

// app.all('*', async (req, res, next) => { // This is how we handle async errors, but if we don't want we can use a package (express-async-errors) which will wait for the async to finish and then call next behind the scenes.
//   next(new NotFoundError());
// });

app.use(errorHandler);

export { app };
