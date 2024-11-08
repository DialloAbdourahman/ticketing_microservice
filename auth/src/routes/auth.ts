import express, { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { PasswordManager } from "../services/password";
import {
  BadRequestError,
  currentUser,
  OrchestrationResult,
  requireAuth,
} from "@daticketslearning/common";

import { validateSignIn, validateSignup } from "../middleware/validate-request";

const router = express.Router();

router.post("/signin", validateSignIn, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials.");
  }

  const passwordsMatch = await PasswordManager.compare(
    existingUser.password,
    password
  );

  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials.");
  }

  // Generate JWT
  const userJwt = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.JWT_KEY as string
  );

  // Store it in the session object
  req.session = {
    jwt: userJwt,
  };

  OrchestrationResult.item(res, existingUser);
});

router.post("/signout", (req: Request, res: Response) => {
  req.session = null;
  OrchestrationResult.success(res);
});

router.post("/signup", validateSignup, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }

  const user = User.build({ email, password });
  await user.save();

  // Generate JWT
  const userJwt = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_KEY as string
  );

  // Store it in the session object
  req.session = {
    jwt: userJwt,
  };

  OrchestrationResult.item(res, user, 201);
});

router.get(
  "/currentuser",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.currentUser?.id);
    OrchestrationResult.item(res, user);
  }
);

export { router as authRouter };
