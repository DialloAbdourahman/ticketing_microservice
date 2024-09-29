import { validateRequest } from "@daticketslearning/common";
import { RequestHandler } from "express";
import { body, ValidationChain } from "express-validator";

// Type alias for Validator Middleware
type ValidatorMiddleware = ValidationChain | RequestHandler;

export const validateCreateTicket: ValidatorMiddleware[] = [
  body("title").not().isEmpty().withMessage("Title must be valid"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
  validateRequest,
];
